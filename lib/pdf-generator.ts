import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function generatePDFFromHTML(html: string): Promise<Buffer> {
  let browser = null;

  try {
    // Vercel/AWS Lambda環境用の設定
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1200, height: 1600 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // HTMLをセット
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // Google Fontsの読み込みを待機
    await page.evaluateHandle('document.fonts.ready');

    // 追加の待機時間（フォントのレンダリング完了用）
    await new Promise(resolve => setTimeout(resolve, 1000));

    // PDFを生成
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
