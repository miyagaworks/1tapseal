import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// この窓口は顧客の注文導線から呼ばれるため認証は掛けられない。
// 代わりに、注文画面が画面上で約束している範囲と同じだけの検査をサーバー側でも行う。

// 許可する拡張子と、保存時に使う種類。
// キーは app/order/page.tsx:1163 の accept=".xlsx,.xls,.csv,.txt" および
// 1098行の案内文（Excel / CSV / テキスト）と一致させること。
// 値は保存時の contentType に使う。送信側の申告値（file.type）は信用しない。
const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xls': 'application/vnd.ms-excel',
  '.csv': 'text/csv',
  '.txt': 'text/plain',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// multipart の境界文字列とヘッダの分だけ、本文は実ファイルより大きくなる。
// 申告値での早期判定はその余裕を見た上限で行い、正確な判定は読み込み後の実サイズで行う。
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 64 * 1024;

const MAX_BASE_NAME_LENGTH = 100;
const FALLBACK_BASE_NAME = 'upload';

// 保存名はアップロード時の元の名前を含むため、外部が自由に決められる値になる。
// 経路の区切り文字と制御文字を取り除き、長さにも上限を設ける。
function sanitizeBaseName(baseName: string): string {
  let stripped = '';
  for (const char of baseName) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint < 0x20 || codePoint === 0x7f) continue; // 制御文字
    if (char === '/' || char === '\\') continue; // 経路の区切り文字
    stripped += char;
  }

  // 文字単位で切り詰める（サロゲートペアを分割して壊れた文字を作らないため）
  const truncated = Array.from(stripped.trim()).slice(0, MAX_BASE_NAME_LENGTH).join('');

  return truncated.length > 0 ? truncated : FALLBACK_BASE_NAME;
}

export async function POST(request: NextRequest) {
  try {
    // 本文を読み込む前に、申告された大きさで早めに弾く
    const declaredSize = Number(request.headers.get('content-length'));
    if (Number.isFinite(declaredSize) && declaredSize > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { error: 'File is too large' },
        { status: 413 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 拡張子は注文画面が受け入れる種類と一致するものだけ許可する
    const trimmedName = file.name.trim();
    const lastDotIndex = trimmedName.lastIndexOf('.');
    const extension = lastDotIndex === -1 ? '' : trimmedName.slice(lastDotIndex).toLowerCase();
    const contentType = CONTENT_TYPE_BY_EXTENSION[extension];

    if (!contentType) {
      return NextResponse.json(
        { error: `Unsupported file type. Allowed: ${Object.keys(CONTENT_TYPE_BY_EXTENSION).join(', ')}` },
        { status: 400 }
      );
    }

    // 読み込んだ後の実サイズでも確認する
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large' },
        { status: 413 }
      );
    }

    // ファイル名を一意にする（タイムスタンプ + オリジナルファイル名）
    const timestamp = Date.now();
    const baseName = sanitizeBaseName(trimmedName.slice(0, lastDotIndex));
    const fileName = `${timestamp}-${baseName}${extension}`;
    const filePath = `excel-files/${fileName}`;

    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Supabase Storageにアップロード（Service Role Keyを使用）
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.storage
      .from('order-files')
      .upload(filePath, buffer, {
        contentType,
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      filePath: data.path
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
