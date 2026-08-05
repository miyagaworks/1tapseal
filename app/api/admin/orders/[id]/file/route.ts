import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// 注文に紐づくExcelファイルをダウンロードさせる。
//
// order-files バケットは非公開のため、ブラウザの anon key では取得できない。
// このルートは /api/admin/ 配下にあり proxy.ts の Basic 認証（matcher: '/api/admin/:path*'）で
// 保護されているため、Service Role Key を使った取得をサーバー側で行う。
//
// 【重要】ストレージのパスはクライアントから受け取らない。
// 受け取ると任意のファイルを読み出せる穴になるため、必ず注文IDからDB経由で引く。

const FALLBACK_FILE_NAME = 'download.xlsx';

// Content-Disposition に載せるファイル名を安全な形に整える。
// 保存名は `excel-files/{timestamp}-{アップロード時の元のファイル名}`（app/api/upload/route.ts）で、
// 元のファイル名は外部が自由に決められる。改行や引用符をそのまま出すと
// ヘッダの分割・破壊につながるため、ヘッダに入れる前に必ずここを通す。
function buildContentDisposition(rawFileName: string): string {
  // quoted-string に安全に入れられる文字（印字可能ASCIIから " と \ を除いたもの / RFC 7230 qdtext）
  // だけを残す。改行・制御文字・非ASCII はここで '_' になる。
  const asciiFileName = rawFileName.replace(/[^\x20-\x21\x23-\x5B\x5D-\x7E]/g, '_');
  const fallbackFileName = asciiFileName.length > 0 ? asciiFileName : FALLBACK_FILE_NAME;

  // 非ASCIIを含む元の名前は RFC 5987 の filename* で渡す。
  // encodeURIComponent が変換しない ' ( ) * も attr-char ではないため明示的に符号化する。
  const encodedFileName = encodeURIComponent(rawFileName).replace(
    /['()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );

  return `attachment; filename="${fallbackFileName}"; filename*=UTF-8''${encodedFileName}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabaseAdmin = getSupabaseAdmin();

    // ストレージのパスは必ずDBから引く（クライアントの指定は受け付けない）
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('excel_file_path')
      .eq('id', id)
      .single();

    if (error || !order) {
      console.error('Error fetching order:', error);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const filePath: string | null = order.excel_file_path ?? null;

    if (!filePath) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const { data: file, error: downloadError } = await supabaseAdmin.storage
      .from('order-files')
      .download(filePath);

    if (downloadError || !file) {
      console.error('Storage download error:', downloadError);
      return NextResponse.json(
        { error: 'Failed to download file' },
        { status: 500 }
      );
    }

    const fileName = filePath.split('/').pop() || FALLBACK_FILE_NAME;
    const arrayBuffer = await file.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': buildContentDisposition(fileName),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error downloading order file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
