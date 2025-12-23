"use client";

import Link from "next/link";
import { MdEmail, MdArrowBack, MdSend } from "react-icons/md";
import { useState } from "react";

interface ContactFormData {
  companyName: string;
  customerName: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

export default function ContactPage() {
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [formData, setFormData] = useState<ContactFormData>({
    companyName: '',
    customerName: '',
    email: '',
    phone: '',
    inquiryType: '一般的なお問い合わせ',
    message: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const inquiryTypes = [
    '一般的なお問い合わせ',
    '製品について',
    '見積もり依頼',
    '納期について',
    'その他'
  ];

  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let firstErrorField: string | null = null;

    // お客様名（必須）
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'お名前を入力してください';
      if (!firstErrorField) firstErrorField = 'customerName';
    }

    // メールアドレス（必須、半角英数字）
    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
      if (!firstErrorField) firstErrorField = 'email';
    } else if (!/^[a-zA-Z0-9@\.\-_]+$/.test(formData.email)) {
      newErrors.email = '半角英数字のみ入力可能です';
      if (!firstErrorField) firstErrorField = 'email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
      if (!firstErrorField) firstErrorField = 'email';
    }

    // 電話番号（必須、半角数字）
    if (!formData.phone) {
      newErrors.phone = '電話番号を入力してください';
      if (!firstErrorField) firstErrorField = 'phone';
    } else if (!/^[0-9]+$/.test(formData.phone)) {
      newErrors.phone = '半角数字のみ入力可能です';
      if (!firstErrorField) firstErrorField = 'phone';
    }

    // お問い合わせ内容（必須）
    if (!formData.message.trim()) {
      newErrors.message = 'お問い合わせ内容を入力してください';
      if (!firstErrorField) firstErrorField = 'message';
    }

    setErrors(newErrors);

    // 最初のエラーフィールドまでスクロール
    if (firstErrorField && Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`) ||
                            document.querySelector(`#${firstErrorField}`) ||
                            document.querySelector('.text-red-600');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  };

  // 確認画面へ
  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('confirm');
      window.scrollTo(0, 0);
    }
  };

  // 送信処理
  const handleSubmit = () => {
    alert('お問い合わせありがとうございます。担当者よりご連絡いたします。');
    // TODO: SendGridを使った実際の送信処理（後で実装）
    // 送信後、トップページに戻る
    window.location.href = '/';
  };

  // 確認画面
  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-gradient-to-r from-primary-light to-primary py-6 px-4 shadow-md">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-text-dark hover:text-text-medium transition-all hover:gap-3 group">
              <MdArrowBack className="text-xl group-hover:scale-110 transition-transform" />
              <span className="font-medium">トップページに戻る</span>
            </Link>
            <div className="flex items-center gap-3 mt-4">
              <MdSend className="text-4xl md:text-5xl text-text-dark" />
              <h1 className="text-3xl md:text-4xl font-bold text-text-dark">
                お問い合わせ内容の確認
              </h1>
            </div>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg p-6 mb-8 border-l-4 border-primary">
              <p className="text-text-dark font-bold">
                以下の内容でよろしければ「送信する」ボタンを押してください。
              </p>
            </div>

            {/* お問い合わせ内容 */}
            <section className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <h2 className="text-xl font-bold text-text-dark mb-4">お問い合わせ内容</h2>
              <div className="space-y-3 text-text-medium">
                {formData.companyName && (
                  <div className="border-b pb-2">
                    <span className="font-semibold">会社名・団体名:</span>
                    <p className="mt-1">{formData.companyName}</p>
                  </div>
                )}
                <div className="border-b pb-2">
                  <span className="font-semibold">お名前:</span>
                  <p className="mt-1">{formData.customerName}</p>
                </div>
                <div className="border-b pb-2">
                  <span className="font-semibold">メールアドレス:</span>
                  <p className="mt-1">{formData.email}</p>
                </div>
                <div className="border-b pb-2">
                  <span className="font-semibold">電話番号:</span>
                  <p className="mt-1">{formData.phone}</p>
                </div>
                <div className="border-b pb-2">
                  <span className="font-semibold">お問い合わせ種類:</span>
                  <p className="mt-1">{formData.inquiryType}</p>
                </div>
                <div className="pt-2">
                  <span className="font-semibold">お問い合わせ内容:</span>
                  <p className="mt-2 whitespace-pre-wrap bg-bg-cream rounded-lg p-4">{formData.message}</p>
                </div>
              </div>
            </section>

            {/* ボタン */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setStep('form')}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-primary-light/10 text-text-dark font-bold py-4 px-8 rounded-full text-lg transition-colors border-2 border-primary-light"
              >
                <MdArrowBack className="text-2xl" />
                内容を修正
              </button>

              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 bg-accent-light hover:bg-accent text-white font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg"
              >
                <MdSend className="text-2xl" />
                送信する
              </button>
            </div>
          </div>
        </main>

        <footer className="bg-gradient-to-br from-text-medium via-text-medium to-text-dark text-bg-cream px-4 py-8 mt-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm">
              &copy; 2025 One Tap Seal by Senrigan Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // フォーム入力画面
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-primary-light to-primary py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-text-dark hover:text-text-medium transition-all hover:gap-3 group">
            <MdArrowBack className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-medium">トップページに戻る</span>
          </Link>
          <div className="flex items-center gap-3 mt-4">
            <MdEmail className="text-4xl md:text-5xl text-text-dark" />
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark">
              お問い合わせ
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg p-6 mb-8 border-l-4 border-primary">
            <p className="text-text-medium">
              ワンタップシールに関するご質問、ご相談、お見積もり依頼など、お気軽にお問い合わせください。
            </p>
          </div>

          <form className="space-y-6">
            {/* 基本情報 */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <label className="block text-lg font-bold text-text-dark mb-4">
                1. お客様情報
              </label>

              <div className="space-y-4">
                <div>
                  <label className="block text-text-dark font-semibold mb-2">
                    会社名・団体名 <span className="text-sm text-text-medium font-normal">（任意）</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-primary-light rounded-lg text-text-dark focus:outline-none focus:border-accent-light"
                    placeholder="株式会社○○"
                  />
                </div>

                <div>
                  <label className="block text-text-dark font-semibold mb-2">
                    お名前 <span className="text-accent-light">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                      errors.customerName ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                    }`}
                    placeholder="山田太郎"
                  />
                  {errors.customerName && <p className="text-red-600 text-sm mt-2">{errors.customerName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-dark font-semibold mb-2">
                      メールアドレス <span className="text-accent-light">*</span> <span className="text-sm text-text-medium font-normal">（半角英数字）</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => {
                        // 半角英数字のみ許可
                        const value = e.target.value.replace(/[^a-zA-Z0-9@\.\-_]/g, '');
                        setFormData(prev => ({ ...prev, email: value }));
                      }}
                      className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                        errors.email ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-text-dark font-semibold mb-2">
                      電話番号 <span className="text-accent-light">*</span> <span className="text-sm text-text-medium font-normal">（ハイフンなし半角数字）</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/[^0-9]/g, '') }))}
                      className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                        errors.phone ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                      }`}
                      placeholder="09012345678"
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-2">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* お問い合わせ内容 */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <label className="block text-lg font-bold text-text-dark mb-4">
                2. お問い合わせ内容
              </label>

              <div className="space-y-4">
                <div>
                  <label className="block text-text-dark font-semibold mb-2">
                    お問い合わせ種類 <span className="text-accent-light">*</span>
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData(prev => ({ ...prev, inquiryType: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-primary-light rounded-lg text-text-dark focus:outline-none focus:border-accent-light"
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-text-dark font-semibold mb-2">
                    お問い合わせ内容 <span className="text-accent-light">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={8}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                      errors.message ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                    }`}
                    placeholder="お問い合わせ内容を詳しくご記入ください"
                  />
                  {errors.message && <p className="text-red-600 text-sm mt-2">{errors.message}</p>}
                </div>
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex items-center justify-center gap-2 bg-accent-light hover:bg-accent text-white font-bold py-4 px-12 rounded-full text-lg transition-colors shadow-lg"
              >
                <MdEmail className="text-2xl" />
                内容を確認
              </button>
            </div>

            <p className="text-center text-text-medium text-sm">
              ※ 確認画面で内容をご確認後、送信してください。
            </p>
          </form>

          {/* 営業時間 */}
          <section className="mt-12">
            <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="font-bold text-text-dark mb-3">営業時間</h3>
              <p className="text-text-medium">
                平日 9:00 - 18:00<br/>
                （土日祝日は休業）
              </p>
              <p className="text-text-medium mt-3 text-sm">
                ※ お問い合わせは24時間受け付けております。<br/>
                ※ 営業時間外のお問い合わせは、翌営業日以降に順次ご回答いたします。
              </p>
            </div>
          </section>

          {/* その他のページへのリンク */}
          <section className="mt-12">
            <div className="bg-bg-cream rounded-lg p-6">
              <h3 className="font-bold text-text-dark mb-4">その他のページ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/order"
                  className="block p-4 bg-white rounded-lg hover:bg-primary-light/10 transition-colors border border-primary-light/30"
                >
                  <span className="font-bold text-text-dark">ご注文ページ →</span>
                </Link>
                <Link
                  href="/faq"
                  className="block p-4 bg-white rounded-lg hover:bg-primary-light/10 transition-colors border border-primary-light/30"
                >
                  <span className="font-bold text-text-dark">よくある質問 →</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gradient-to-br from-text-medium via-text-medium to-text-dark text-bg-cream px-4 py-8 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">
            &copy; 2025 One Tap Seal by Senrigan Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
