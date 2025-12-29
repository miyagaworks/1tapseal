"use client";

import Link from "next/link";
import { MdShoppingCart, MdUploadFile, MdArrowBack, MdCheck, MdSearch } from "react-icons/md";
import { useState, useEffect } from "react";
import { GoogleMap } from "@/lib/components/GoogleMap";

type PaymentMethod = 'card' | 'bank_transfer';

interface FormData {
  quantity: number;
  urls: string[];
  urlMemos: string[];
  useSingleUrl: boolean;
  singleUrl: string;
  useSpreadsheet: boolean;
  spreadsheetUrl: string;
  excelFile: File | null;
  companyName: string;
  customerName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  building: string;
  phone: string;
  email: string;
  // 支払い方法
  paymentMethod: PaymentMethod;
  // 請求書情報（銀行振込の場合）
  invoiceCompanyName: string;
  invoiceContactName: string;
  invoicePostalCode: string;
  invoiceAddress: string;
  useDeliveryAddressForInvoice: boolean;
  remarks: string;
  agreeToTerms: boolean;
}

export default function OrderPage() {
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [formData, setFormData] = useState<FormData>({
    quantity: 1,
    urls: [''],
    urlMemos: [''],
    useSingleUrl: false,
    singleUrl: '',
    useSpreadsheet: false,
    spreadsheetUrl: '',
    excelFile: null,
    companyName: '',
    customerName: '',
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
    phone: '',
    email: '',
    // 支払い方法
    paymentMethod: 'card',
    // 請求書情報
    invoiceCompanyName: '',
    invoiceContactName: '',
    invoicePostalCode: '',
    invoiceAddress: '',
    useDeliveryAddressForInvoice: true,
    remarks: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [postalCodeSuggestions, setPostalCodeSuggestions] = useState<string[]>([]);
  const [shorteningUrl, setShorteningUrl] = useState<string | null>(null); // 短縮中のURL識別子
  const [isSubmitting, setIsSubmitting] = useState(false); // 注文送信中フラグ

  // URL短縮ヘルパー関数
  const shortenUrl = async (url: string): Promise<string | null> => {
    if (!url || url.length <= 130) return null;

    try {
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const shortUrl = await response.text();
      if (shortUrl && shortUrl.startsWith('http')) {
        return shortUrl;
      }
      return null;
    } catch (error) {
      console.error('URL短縮エラー:', error);
      return null;
    }
  };

  // 自動URL短縮（onBlur時に呼び出し）
  const handleUrlBlur = async (url: string, index: number) => {
    if (url.length > 130) {
      setShorteningUrl(`url_${index}`);
      const shortUrl = await shortenUrl(url);
      if (shortUrl) {
        const newUrls = [...formData.urls];
        newUrls[index] = shortUrl;
        setFormData(prev => ({ ...prev, urls: newUrls }));
      }
      setShorteningUrl(null);
    }
  };

  // 単一URL短縮（onBlur時に呼び出し）
  const handleSingleUrlBlur = async (url: string) => {
    if (url.length > 130) {
      setShorteningUrl('singleUrl');
      const shortUrl = await shortenUrl(url);
      if (shortUrl) {
        setFormData(prev => ({ ...prev, singleUrl: shortUrl }));
      }
      setShorteningUrl(null);
    }
  };

  // 価格計算
  const calculatePrice = (qty: number) => {
    let unitPrice = 550;
    if (qty >= 10 && qty < 50) {
      unitPrice = 528;
    } else if (qty >= 50 && qty < 100) {
      unitPrice = 462;
    }
    const subtotal = unitPrice * qty;
    const shipping = 220;
    return {
      unitPrice,
      subtotal,
      shipping,
      total: subtotal + shipping
    };
  };

  const price = calculatePrice(formData.quantity);

  // 数量変更時の処理
  const handleQuantityChange = (value: number) => {
    const newQty = Math.max(1, value);
    const newUrls = newQty <= 10
      ? Array(newQty).fill('').map((_, i) => formData.urls[i] || '')
      : formData.urls;
    const newUrlMemos = newQty <= 10
      ? Array(newQty).fill('').map((_, i) => formData.urlMemos[i] || '')
      : formData.urlMemos;

    setFormData(prev => ({
      ...prev,
      quantity: newQty,
      urls: newUrls,
      urlMemos: newUrlMemos
    }));
  };

  // 郵便番号から住所を自動入力
  const handlePostalCodeChange = async (value: string) => {
    // ハイフンと半角数字以外を削除し、ハイフンも削除して数字のみにする
    const numericValue = value.replace(/[^0-9\-]/g, '').replace(/\-/g, '');

    setFormData(prev => ({ ...prev, postalCode: numericValue }));

    // 7桁入力されたら住所検索
    if (numericValue.length === 7) {
      try {
        const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${numericValue}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          setFormData(prev => ({
            ...prev,
            prefecture: result.address1,
            city: result.address2 + result.address3
          }));
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.postalCode;
            return newErrors;
          });
        } else {
          setErrors(prev => ({ ...prev, postalCode: '郵便番号が見つかりません' }));
        }
      } catch (error) {
        console.error('郵便番号検索エラー:', error);
      }
    }
  };

  // 住所から郵便番号を検索
  const handleAddressToPostalCode = () => {
    // 日本郵便の郵便番号検索サイトを開く
    const searchUrl = `https://www.post.japanpost.jp/zipcode/`;
    window.open(searchUrl, '_blank');
  };

  // 請求書用郵便番号から住所を自動入力
  const handleInvoicePostalCodeChange = async (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, invoicePostalCode: numericValue }));

    // 7桁入力されたら住所検索
    if (numericValue.length === 7) {
      try {
        const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${numericValue}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const fullAddress = `${result.address1}${result.address2}${result.address3}`;
          setFormData(prev => ({
            ...prev,
            invoiceAddress: fullAddress
          }));
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.invoicePostalCode;
            return newErrors;
          });
        } else {
          setErrors(prev => ({ ...prev, invoicePostalCode: '郵便番号が見つかりません' }));
        }
      } catch (error) {
        console.error('郵便番号検索エラー:', error);
      }
    }
  };

  // 地図表示用の住所を生成
  const mapAddress = formData.prefecture && formData.city && formData.address
    ? `${formData.prefecture}${formData.city}${formData.address}`
    : '';

  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let firstErrorField: string | null = null;

    // 数量チェック
    if (formData.quantity < 1) {
      newErrors.quantity = '1枚以上を指定してください';
      if (!firstErrorField) firstErrorField = 'quantity';
    }

    // URLチェック
    if (formData.quantity <= 10) {
      // 2枚以上で「全て同じURL」を選択した場合
      if (formData.quantity >= 2 && formData.useSingleUrl) {
        if (!formData.singleUrl) {
          newErrors.singleUrl = 'URLを入力してください';
          if (!firstErrorField) firstErrorField = 'singleUrl';
        } else if (!/^[a-zA-Z0-9:\/\.\-_?=&#%]+$/.test(formData.singleUrl)) {
          newErrors.singleUrl = '半角英数字のみ入力可能です';
          if (!firstErrorField) firstErrorField = 'singleUrl';
        }
      } else {
        // 1枚の場合、または個別指定を選択した場合
        const hasUrl = formData.urls.some(url => url.trim() !== '');
        if (!hasUrl) {
          newErrors.urls = '少なくとも1つのURLを入力してください';
          if (!firstErrorField) firstErrorField = 'urls';
        }
        // URL形式チェック（半角英数字）
        formData.urls.forEach((url, idx) => {
          if (url && !/^[a-zA-Z0-9:\/\.\-_?=&#%]+$/.test(url)) {
            newErrors[`url_${idx}`] = '半角英数字のみ入力可能です';
            if (!firstErrorField) firstErrorField = 'urls';
          }
        });
      }
    } else {
      // 11枚以上の場合：単一URL、Excelファイル、またはスプレッドシートURLが必要
      if (formData.useSingleUrl) {
        if (!formData.singleUrl) {
          newErrors.singleUrl = 'URLを入力してください';
          if (!firstErrorField) firstErrorField = 'singleUrl';
        } else if (!/^[a-zA-Z0-9:\/\.\-_?=&#%]+$/.test(formData.singleUrl)) {
          newErrors.singleUrl = '半角英数字のみ入力可能です';
          if (!firstErrorField) firstErrorField = 'singleUrl';
        }
      } else if (formData.useSpreadsheet) {
        if (!formData.spreadsheetUrl) {
          newErrors.spreadsheetUrl = 'スプレッドシートのURLを入力してください';
          if (!firstErrorField) firstErrorField = 'spreadsheetUrl';
        } else if (!/^[a-zA-Z0-9:\/\.\-_?=&#%]+$/.test(formData.spreadsheetUrl)) {
          newErrors.spreadsheetUrl = '半角英数字のみ入力可能です';
          if (!firstErrorField) firstErrorField = 'spreadsheetUrl';
        }
      } else {
        if (!formData.excelFile) {
          newErrors.excelFile = 'Excelファイルを添付してください';
          if (!firstErrorField) firstErrorField = 'excelFile';
        }
      }
    }

    // お客様名（必須）
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'お名前を入力してください';
      if (!firstErrorField) firstErrorField = 'customerName';
    }

    // 郵便番号（任意、入力された場合は7桁チェック）
    if (formData.postalCode && formData.postalCode.length !== 7) {
      newErrors.postalCode = '7桁の郵便番号を入力してください';
      if (!firstErrorField) firstErrorField = 'postalCode';
    }

    // 都道府県・市区町村（必須）
    if (!formData.prefecture) {
      newErrors.prefecture = '都道府県を入力してください';
      if (!firstErrorField) firstErrorField = 'prefecture';
    }
    if (!formData.city) {
      newErrors.city = '市区町村を入力してください';
      if (!firstErrorField) firstErrorField = 'city';
    }

    // 番地（必須）
    if (!formData.address.trim()) {
      newErrors.address = '番地を入力してください';
      if (!firstErrorField) firstErrorField = 'address';
    }

    // 電話番号（必須、半角数字、10-11桁）
    if (!formData.phone) {
      newErrors.phone = '電話番号を入力してください';
      if (!firstErrorField) firstErrorField = 'phone';
    } else if (!/^[0-9]+$/.test(formData.phone)) {
      newErrors.phone = '半角数字のみ入力可能です';
      if (!firstErrorField) firstErrorField = 'phone';
    } else if (formData.phone.length < 10 || formData.phone.length > 11) {
      newErrors.phone = '電話番号は10桁または11桁で入力してください';
      if (!firstErrorField) firstErrorField = 'phone';
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

    // 銀行振込の場合、請求書情報をバリデーション
    if (formData.paymentMethod === 'bank_transfer') {
      const invoiceCompanyName = formData.useDeliveryAddressForInvoice
        ? formData.companyName
        : formData.invoiceCompanyName;
      const invoiceContactName = formData.useDeliveryAddressForInvoice
        ? formData.customerName
        : formData.invoiceContactName;
      const invoicePostalCode = formData.useDeliveryAddressForInvoice
        ? formData.postalCode
        : formData.invoicePostalCode;
      const invoiceAddress = formData.useDeliveryAddressForInvoice
        ? `${formData.prefecture}${formData.city}${formData.address}${formData.building ? ' ' + formData.building : ''}`
        : formData.invoiceAddress;

      // 会社名か担当者名のどちらかは必須
      if (!invoiceCompanyName.trim() && !invoiceContactName.trim()) {
        newErrors.invoiceContactName = '会社名または担当者名を入力してください';
        if (!firstErrorField) firstErrorField = 'invoiceContactName';
      }
      if (!invoicePostalCode || invoicePostalCode.length !== 7) {
        newErrors.invoicePostalCode = '7桁の郵便番号を入力してください';
        if (!firstErrorField) firstErrorField = 'invoicePostalCode';
      }
      if (!invoiceAddress.trim()) {
        newErrors.invoiceAddress = '請求書送付先住所を入力してください';
        if (!firstErrorField) firstErrorField = 'invoiceAddress';
      }
    }

    // 利用規約同意（必須）
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '利用規約とプライバシーポリシーに同意してください';
      if (!firstErrorField) firstErrorField = 'agreeToTerms';
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

  // フォームが完成しているかチェック（ボタン有効化用）
  const isFormComplete = (): boolean => {
    // URL関連
    if (formData.quantity <= 10) {
      if (formData.useSingleUrl) {
        if (!formData.singleUrl.trim()) return false;
      } else {
        // 各URLをチェック
        for (let i = 0; i < formData.quantity; i++) {
          if (!formData.urls[i] || !formData.urls[i].trim()) return false;
        }
      }
    } else {
      // 11枚以上
      if (formData.useSingleUrl) {
        if (!formData.singleUrl.trim()) return false;
      } else if (formData.useSpreadsheet) {
        if (!formData.spreadsheetUrl.trim()) return false;
      } else {
        if (!formData.excelFile) return false;
      }
    }

    // 顧客情報
    if (!formData.customerName.trim()) return false;
    if (!formData.prefecture) return false;
    if (!formData.city) return false;
    if (!formData.address.trim()) return false;
    if (!formData.phone || formData.phone.length < 10) return false;
    if (!formData.email || !formData.email.includes('@')) return false;

    // 銀行振込の場合、請求書情報も必要
    if (formData.paymentMethod === 'bank_transfer') {
      if (!formData.useDeliveryAddressForInvoice) {
        // 会社名か担当者名のどちらかは必須
        if (!formData.invoiceCompanyName.trim() && !formData.invoiceContactName.trim()) return false;
        if (!formData.invoicePostalCode || formData.invoicePostalCode.length !== 7) return false;
        if (!formData.invoiceAddress.trim()) return false;
      } else {
        // 配送先を使う場合、配送先情報が必要
        if (!formData.postalCode || formData.postalCode.length !== 7) return false;
      }
    }

    // 利用規約同意
    if (!formData.agreeToTerms) return false;

    return true;
  };

  // 確認画面へ
  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('confirm');
      window.scrollTo(0, 0);
    }
  };

  // 注文送信
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 注文データの準備
      const fullAddress = `${formData.prefecture}${formData.city}${formData.address}${formData.building ? ' ' + formData.building : ''}`;

      // 使用するURLを決定
      let orderUrl = '';
      let orderMemo = '';

      if (formData.quantity <= 10) {
        // 2枚以上で「全て同じURL」を選択した場合
        if (formData.quantity >= 2 && formData.useSingleUrl) {
          orderUrl = formData.singleUrl.trim();
          orderMemo = `全てのシールに同じURLを使用（${formData.quantity}枚）`;
        } else {
          // 1枚の場合、または個別指定を選択した場合
          const filledUrls = formData.urls.filter(url => url.trim() !== '');
          orderUrl = filledUrls.length > 0 ? filledUrls[0].trim() : '';
          orderMemo = `複数URL（${filledUrls.length}件）:\n${formData.urls.map((url, i) => url.trim() ? `${i+1}. ${url}${formData.urlMemos[i] ? ' (' + formData.urlMemos[i] + ')' : ''}` : '').filter(Boolean).join('\n')}`;
        }
      } else {
        // 11枚以上
        if (formData.useSingleUrl) {
          orderUrl = formData.singleUrl.trim();
          orderMemo = '全てのシールに同じURLを使用';
        } else if (formData.useSpreadsheet) {
          orderUrl = formData.spreadsheetUrl.trim();
          orderMemo = `スプレッドシートURL: ${formData.spreadsheetUrl}`;
        } else if (formData.excelFile) {
          orderUrl = 'Excel添付';
          orderMemo = `Excelファイル: ${formData.excelFile.name} (${(formData.excelFile.size / 1024).toFixed(2)} KB)`;
        }
      }

      if (formData.remarks) {
        orderMemo += `\n\n備考: ${formData.remarks}`;
      }

      // Excelファイルのアップロード
      let excelFilePath: string | undefined;
      if (formData.excelFile) {
        const fileFormData = new FormData();
        fileFormData.append('file', formData.excelFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: fileFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('ファイルのアップロードに失敗しました');
        }

        const uploadResult = await uploadResponse.json();
        excelFilePath = uploadResult.filePath;
      }

      // 請求書情報を決定
      const invoiceCompanyName = formData.useDeliveryAddressForInvoice
        ? formData.companyName
        : formData.invoiceCompanyName;
      const invoiceContactName = formData.useDeliveryAddressForInvoice
        ? formData.customerName
        : formData.invoiceContactName;
      const invoicePostalCode = formData.useDeliveryAddressForInvoice
        ? formData.postalCode
        : formData.invoicePostalCode;
      const invoiceAddress = formData.useDeliveryAddressForInvoice
        ? fullAddress
        : formData.invoiceAddress;

      // 請求書宛名を生成（会社名があれば会社名、なければ担当者名）
      const invoiceRecipientName = invoiceCompanyName.trim()
        ? invoiceCompanyName.trim() + (invoiceContactName.trim() ? ` ${invoiceContactName.trim()}` : '')
        : invoiceContactName.trim();

      const orderData = {
        quantity: formData.quantity,
        url: orderUrl,
        memo: orderMemo,
        excel_file_path: excelFilePath,
        customer_company_name: formData.companyName.trim(),
        customer_name: formData.customerName.trim(),
        customer_email: formData.email.trim(),
        customer_postal_code: formData.postalCode.trim(),
        customer_prefecture: formData.prefecture.trim(),
        customer_city: formData.city.trim(),
        customer_street_address: formData.address.trim(),
        customer_building: formData.building.trim(),
        customer_address: fullAddress.trim(),
        customer_phone: formData.phone.trim(),
        // 支払い情報
        payment_method: formData.paymentMethod,
        payment_amount: price.total,
        // 請求書情報（銀行振込の場合のみ）
        ...(formData.paymentMethod === 'bank_transfer' && {
          invoice_company_name: invoiceCompanyName.trim(),
          invoice_contact_name: invoiceContactName.trim(),
          invoice_recipient_name: invoiceRecipientName,
          invoice_postal_code: invoicePostalCode.trim(),
          invoice_address: invoiceAddress.trim(),
        }),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '注文の送信に失敗しました');
      }

      const result = await response.json();

      // カード決済の場合はStripeチェックアウトにリダイレクト
      if (formData.paymentMethod === 'card') {
        // Stripe Checkout Sessionを作成
        const checkoutResponse = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: result.order.id }),
        });

        if (!checkoutResponse.ok) {
          throw new Error('決済セッションの作成に失敗しました');
        }

        const checkoutResult = await checkoutResponse.json();
        // Stripeの決済ページにリダイレクト
        window.location.href = checkoutResult.url;
        return;
      }

      // 銀行振込の場合は完了メッセージを表示
      alert('ご注文ありがとうございます！\n請求書をメールでお送りしましたので、お振込みをお願いいたします。');
      window.location.href = '/';
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`注文の送信に失敗しました。\n${error instanceof Error ? error.message : '不明なエラー'}\n\nもう一度お試しいただくか、お問い合わせください。`);
      setIsSubmitting(false);
    }
  };

  // 確認画面
  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-white">
        {/* ローディングオーバーレイ */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 mx-4">
              <div className="animate-spin h-12 w-12 border-4 border-accent-light border-t-transparent rounded-full"></div>
              <p className="text-text-dark font-bold text-lg">ご注文を処理中...</p>
              <p className="text-text-medium text-sm text-center">
                しばらくお待ちください。<br />
                画面を閉じないでください。
              </p>
            </div>
          </div>
        )}
        <header className="sticky top-0 z-50 bg-gradient-to-r from-primary-light to-primary py-6 px-4 shadow-md">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-text-dark hover:text-text-medium transition-all hover:gap-3 group">
              <MdArrowBack className="text-xl group-hover:scale-110 transition-transform" />
              <span className="font-medium">トップページに戻る</span>
            </Link>
            <div className="flex items-center gap-3 mt-4">
              <MdCheck className="text-4xl md:text-5xl text-text-dark" />
              <h1 className="text-3xl md:text-4xl font-bold text-text-dark">
                ご注文内容の確認
              </h1>
            </div>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-light/30 to-primary/30 rounded-lg p-6 mb-8 border-l-4 border-primary">
              <p className="text-text-dark font-bold">
                以下の内容でよろしければ「注文を確定する」ボタンを押してください。
              </p>
            </div>

            {/* 注文内容 */}
            <section className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <h2 className="text-xl font-bold text-text-dark mb-4">注文内容</h2>
              <div className="space-y-3 text-text-medium">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">枚数:</span>
                  <span>{formData.quantity}枚</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">単価:</span>
                  <span>{price.unitPrice.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">小計:</span>
                  <span>{price.subtotal.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">送料:</span>
                  <span>{price.shipping.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-accent-light pt-2">
                  <span>合計（税込）:</span>
                  <span>{price.total.toLocaleString()}円</span>
                </div>
              </div>
            </section>

            {/* URL情報 */}
            <section className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <h2 className="text-xl font-bold text-text-dark mb-4">書き込みURL情報</h2>
              {formData.quantity <= 10 ? (
                formData.quantity >= 2 && formData.useSingleUrl ? (
                  <div className="text-text-medium">
                    <p className="mb-2"><span className="font-semibold">全て同じURL:</span></p>
                    <p className="ml-4">{formData.singleUrl}</p>
                    <p className="mt-2 text-sm text-text-medium">（全{formData.quantity}枚に同じURLを書き込みます）</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.urls.map((url, idx) => url && (
                      <div key={idx} className="border-b pb-2">
                        <div className="text-text-medium">
                          <span className="font-semibold">{idx + 1}枚目:</span>
                        </div>
                        <div className="ml-4 mt-1">
                          <p className="text-sm"><span className="font-semibold">URL:</span> {url}</p>
                          {formData.urlMemos[idx] && (
                            <p className="text-sm text-text-medium mt-1">
                              <span className="font-semibold">識別メモ:</span> {formData.urlMemos[idx]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-text-medium">
                  {formData.useSingleUrl ? (
                    <div>
                      <p className="mb-2"><span className="font-semibold">全て同じURL:</span></p>
                      <p className="ml-4">{formData.singleUrl}</p>
                      <p className="mt-2 text-sm text-text-medium">（全{formData.quantity}枚に同じURLを書き込みます）</p>
                    </div>
                  ) : formData.useSpreadsheet ? (
                    <p><span className="font-semibold">スプレッドシートURL:</span> {formData.spreadsheetUrl}</p>
                  ) : formData.excelFile ? (
                    <p><span className="font-semibold">添付ファイル:</span> {formData.excelFile.name} ({(formData.excelFile.size / 1024).toFixed(2)} KB)</p>
                  ) : (
                    <p>Excelファイルを後ほどメールで送付</p>
                  )}
                </div>
              )}
            </section>

            {/* お届け先情報 */}
            <section className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <h2 className="text-xl font-bold text-text-dark mb-4">お届け先情報</h2>
              <div className="space-y-2 text-text-medium">
                {formData.companyName && <p><span className="font-semibold">会社名:</span> {formData.companyName}</p>}
                <p><span className="font-semibold">お名前:</span> {formData.customerName}</p>
                <p><span className="font-semibold">郵便番号:</span> 〒{formData.postalCode}</p>
                <p><span className="font-semibold">住所:</span> {formData.prefecture}{formData.city}{formData.address}{formData.building && ` ${formData.building}`}</p>
                <p><span className="font-semibold">電話番号:</span> {formData.phone}</p>
                <p><span className="font-semibold">メールアドレス:</span> {formData.email}</p>
              </div>

              {/* Google Map */}
              {mapAddress && (
                <div className="mt-6">
                  <h3 className="font-bold text-text-dark mb-3">配送先地図</h3>
                  <GoogleMap
                    address={mapAddress}
                    className="w-full h-64 md:h-96 rounded-lg overflow-hidden border-2 border-primary-light"
                  />
                </div>
              )}
            </section>

            {/* お支払い方法 */}
            <section className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <h2 className="text-xl font-bold text-text-dark mb-4">お支払い方法</h2>
              <div className="space-y-2 text-text-medium">
                <p>
                  <span className="font-semibold">支払い方法:</span>{' '}
                  {formData.paymentMethod === 'card' ? 'クレジットカード決済' : '銀行振込'}
                </p>
                {formData.paymentMethod === 'bank_transfer' && (
                  <>
                    <p className="text-sm text-accent-light mt-2">
                      ※ 注文確定後、請求書をメールでお送りします。14日以内にお振込みください。
                    </p>
                  </>
                )}
              </div>
            </section>

            {/* 請求書情報（銀行振込の場合） */}
            {formData.paymentMethod === 'bank_transfer' && (() => {
              const companyName = formData.useDeliveryAddressForInvoice ? formData.companyName : formData.invoiceCompanyName;
              const contactName = formData.useDeliveryAddressForInvoice ? formData.customerName : formData.invoiceContactName;
              return (
                <section className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
                  <h2 className="text-xl font-bold text-text-dark mb-4">請求書情報</h2>
                  <div className="space-y-2 text-text-medium">
                    {companyName && (
                      <p>
                        <span className="font-semibold">会社名:</span> {companyName} 御中
                      </p>
                    )}
                    {contactName && (
                      <p>
                        <span className="font-semibold">{companyName ? '担当者名' : '宛名'}:</span> {contactName} 様
                      </p>
                    )}
                    <p>
                      <span className="font-semibold">郵便番号:</span>{' '}
                      〒{formData.useDeliveryAddressForInvoice ? formData.postalCode : formData.invoicePostalCode}
                    </p>
                    <p>
                      <span className="font-semibold">送付先住所:</span>{' '}
                      {formData.useDeliveryAddressForInvoice
                        ? `${formData.prefecture}${formData.city}${formData.address}${formData.building ? ' ' + formData.building : ''}`
                        : formData.invoiceAddress}
                    </p>
                  </div>
                </section>
              );
            })()}

            {/* 備考 */}
            {formData.remarks && (
              <section className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
                <h2 className="text-xl font-bold text-text-dark mb-4">備考・ご要望</h2>
                <div className="text-text-medium">
                  <p style={{ whiteSpace: 'pre-wrap' }}>{formData.remarks}</p>
                </div>
              </section>
            )}

            {/* ボタン */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setStep('form')}
                disabled={isSubmitting}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-full text-lg transition-colors border-2 ${
                  isSubmitting
                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'bg-white hover:bg-primary-light/10 text-text-dark border-primary-light'
                }`}
              >
                <MdArrowBack className="text-2xl" />
                内容を修正
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-accent-light hover:bg-accent text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
                    処理中...
                  </>
                ) : (
                  <>
                    <MdCheck className="text-2xl" />
                    注文を確定する
                  </>
                )}
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
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary-light to-primary py-6 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-text-dark hover:text-text-medium transition-all hover:gap-3 group">
            <MdArrowBack className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-medium">トップページに戻る</span>
          </Link>
          <div className="flex items-center gap-3 mt-4">
            <MdShoppingCart className="text-4xl md:text-5xl text-text-dark" />
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark">
              ご注文フォーム
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <form className="space-y-8">
            {/* 注文枚数 */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <label className="block text-lg font-bold text-text-dark mb-3">
                1. ご注文枚数 <span className="text-accent-light">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                onFocus={(e) => {
                  if (formData.quantity === 1) {
                    e.target.select();
                  }
                }}
                className={`w-full md:w-64 px-4 py-3 border-2 rounded-lg text-lg font-bold text-text-dark focus:outline-none ${
                  errors.quantity ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                }`}
              />
              {errors.quantity && <p className="text-red-600 text-sm mt-2">{errors.quantity}</p>}

              <div className="mt-4 bg-gradient-to-r from-primary-light/20 to-primary/10 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xs text-text-medium">単価</div>
                    <div className="text-lg font-bold text-text-dark">{price.unitPrice.toLocaleString()}円</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-medium">小計</div>
                    <div className="text-lg font-bold text-text-dark">{price.subtotal.toLocaleString()}円</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-medium">送料</div>
                    <div className="text-lg font-bold text-text-dark">{price.shipping.toLocaleString()}円</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-medium">合計（税込）</div>
                    <div className="text-xl font-bold text-accent-light">{price.total.toLocaleString()}円</div>
                  </div>
                </div>
              </div>
            </div>

            {/* URL情報 */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <label className="block text-lg font-bold text-text-dark mb-3">
                2. 書き込みURL情報 <span className="text-accent-light">*</span>
              </label>

              {formData.quantity <= 10 ? (
                <div className="space-y-3">
                  {/* 2枚以上の場合、全て同じURLオプションを表示 */}
                  {formData.quantity >= 2 && (
                    <div className="bg-gradient-to-r from-primary-light/20 to-primary/10 rounded-lg p-4 mb-4">
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="urlMode"
                            checked={formData.useSingleUrl}
                            onChange={() => setFormData(prev => ({ ...prev, useSingleUrl: true }))}
                            className="w-5 h-5 text-accent-light"
                          />
                          <span className="text-text-dark font-semibold">全て同じURLを使用</span>
                        </label>
                        {formData.useSingleUrl && (
                          <div className="ml-8">
                            <div className="relative">
                              <input
                                type="text"
                                value={formData.singleUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, singleUrl: e.target.value }))}
                                onBlur={(e) => handleSingleUrlBlur(e.target.value)}
                                placeholder="https://example.com"
                                disabled={shorteningUrl === 'singleUrl'}
                                className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                                  errors.singleUrl ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                                } ${shorteningUrl === 'singleUrl' ? 'bg-gray-100' : ''}`}
                              />
                              {shorteningUrl === 'singleUrl' && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <div className="animate-spin h-5 w-5 border-2 border-accent-light border-t-transparent rounded-full"></div>
                                </div>
                              )}
                            </div>
                            {shorteningUrl === 'singleUrl' && (
                              <p className="text-accent-light text-sm mt-1">URLを自動短縮中...</p>
                            )}
                            {errors.singleUrl && <p className="text-red-600 text-sm mt-1">{errors.singleUrl}</p>}
                            <p className="text-text-medium text-sm mt-2">
                              全{formData.quantity}枚のシールに同じURLを書き込みます
                              {formData.singleUrl.length > 130 && <span className="text-amber-600 ml-2">（130文字超過時は自動短縮）</span>}
                            </p>
                          </div>
                        )}

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="urlMode"
                            checked={!formData.useSingleUrl}
                            onChange={() => setFormData(prev => ({ ...prev, useSingleUrl: false }))}
                            className="w-5 h-5 text-accent-light"
                          />
                          <span className="text-text-dark font-semibold">シールごとに異なるURLを指定</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* 個別URL入力（1枚の場合、または個別指定を選択した場合） */}
                  {(formData.quantity === 1 || !formData.useSingleUrl) && (
                    <>
                      {formData.quantity >= 2 && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-text-dark text-sm mb-3">
                            各シールに書き込むURLとメモを入力してください（半角英数字のみ）
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (formData.urls[0]) {
                                const newUrls = Array(formData.quantity).fill(formData.urls[0]);
                                setFormData(prev => ({ ...prev, urls: newUrls }));
                              }
                            }}
                            className="flex items-center gap-2 bg-accent-light hover:bg-accent text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            <MdCheck className="text-lg" />
                            1枚目のURLを全てに適用
                          </button>
                        </div>
                      )}

                      {formData.urls.map((url, index) => (
                    <div key={index}>
                      <div className="flex gap-2 items-start">
                        <span className="text-text-medium font-semibold w-16 pt-2">{index + 1}枚目:</span>
                        <div className="flex-1 space-y-2">
                          <div>
                            <label className="block text-xs text-text-medium mb-1">
                              URL
                              {shorteningUrl === `url_${index}` && <span className="text-accent-light ml-2">短縮中...</span>}
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={url}
                                onChange={(e) => {
                                  const newUrls = [...formData.urls];
                                  newUrls[index] = e.target.value;
                                  setFormData(prev => ({ ...prev, urls: newUrls }));
                                }}
                                onBlur={(e) => handleUrlBlur(e.target.value, index)}
                                disabled={shorteningUrl === `url_${index}`}
                                placeholder="https://example.com"
                                className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                                  errors[`url_${index}`] || errors.urls ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                                } ${shorteningUrl === `url_${index}` ? 'bg-gray-100' : ''}`}
                              />
                              {shorteningUrl === `url_${index}` && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <div className="animate-spin h-5 w-5 border-2 border-accent-light border-t-transparent rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-text-medium mb-1">
                              識別メモ <span className="text-xs text-text-medium">(任意・15文字以内)</span>
                            </label>
                            <input
                              type="text"
                              value={formData.urlMemos[index] || ''}
                              onChange={(e) => {
                                const newMemos = [...formData.urlMemos];
                                newMemos[index] = e.target.value.slice(0, 15);
                                setFormData(prev => ({ ...prev, urlMemos: newMemos }));
                              }}
                              maxLength={15}
                              placeholder="例: テーブル1、入口用、A棟1F"
                              className="w-full px-4 py-2 border-2 border-primary-light rounded-lg text-text-dark focus:outline-none focus:border-accent-light text-sm"
                            />
                            <p className="text-xs text-text-medium mt-1">
                              ※ シール台紙の裏面に小さなラベルを貼って識別します
                            </p>
                          </div>
                        </div>
                      </div>
                      {url.length > 130 && shorteningUrl !== `url_${index}` && (
                        <div className="ml-16 mt-2 bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                          <p className="text-amber-700 text-sm">
                            ⚠️ URLが130文字を超えています（現在{url.length}文字）。入力欄を離れると自動で短縮されます。
                          </p>
                        </div>
                      )}
                      {errors[`url_${index}`] && <p className="text-red-600 text-sm mt-1 ml-16">{errors[`url_${index}`]}</p>}
                    </div>
                  ))}
                  {errors.urls && <p className="text-red-600 text-sm mt-2">{errors.urls}</p>}
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary-light/20 to-primary/10 rounded-lg p-4">
                    <p className="text-text-dark font-semibold mb-2">
                      <MdUploadFile className="inline text-accent-light text-xl mr-2" />
                      11枚以上のご注文の場合
                    </p>
                    <p className="text-text-medium text-sm">
                      全て同じURLの場合は直接入力、異なるURLの場合はExcel (.xlsx, .xls)、CSV (.csv)、テキスト (.txt) ファイル、または Googleスプレッドシート（共有URL）でURL情報をご提供ください。
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.useSingleUrl}
                        onChange={() => setFormData(prev => ({ ...prev, useSingleUrl: true, useSpreadsheet: false, excelFile: null }))}
                        className="w-4 h-4"
                      />
                      <span className="text-text-dark">全て同じURL</span>
                    </label>

                    {formData.useSingleUrl && (
                      <div className="ml-6">
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.singleUrl}
                            onChange={(e) => {
                              // 半角英数字のみ許可
                              const value = e.target.value.replace(/[^a-zA-Z0-9:\/\.\-_?=&#%]/g, '');
                              setFormData(prev => ({ ...prev, singleUrl: value }));
                            }}
                            onBlur={(e) => handleSingleUrlBlur(e.target.value)}
                            disabled={shorteningUrl === 'singleUrl'}
                            placeholder="https://example.com"
                            className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                              errors.singleUrl ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                            } ${shorteningUrl === 'singleUrl' ? 'bg-gray-100' : ''}`}
                          />
                          {shorteningUrl === 'singleUrl' && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="animate-spin h-5 w-5 border-2 border-accent-light border-t-transparent rounded-full"></div>
                            </div>
                          )}
                        </div>
                        {shorteningUrl === 'singleUrl' && (
                          <p className="text-accent-light text-sm mt-1">URLを自動短縮中...</p>
                        )}
                        {formData.singleUrl.length > 130 && !shorteningUrl && (
                          <p className="text-amber-600 text-sm mt-1">
                            ※ 130文字を超えているため、入力欄を離れると自動で短縮されます
                          </p>
                        )}
                        {errors.singleUrl && <p className="text-red-600 text-sm mt-2">{errors.singleUrl}</p>}
                      </div>
                    )}

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!formData.useSingleUrl && !formData.useSpreadsheet}
                        onChange={() => setFormData(prev => ({ ...prev, useSingleUrl: false, useSpreadsheet: false, spreadsheetUrl: '' }))}
                        className="w-4 h-4"
                      />
                      <span className="text-text-dark">Excelファイルを添付</span>
                    </label>

                    {!formData.useSingleUrl && !formData.useSpreadsheet && (
                      <div className="ml-6">
                        <input
                          type="file"
                          accept=".xlsx,.xls,.csv,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setFormData(prev => ({ ...prev, excelFile: file }));
                          }}
                          className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                            errors.excelFile ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                          }`}
                        />
                        {formData.excelFile && (
                          <p className="text-text-medium text-sm mt-2">
                            選択されたファイル: {formData.excelFile.name}
                          </p>
                        )}
                        {errors.excelFile && <p className="text-red-600 text-sm mt-2">{errors.excelFile}</p>}
                      </div>
                    )}

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!formData.useSingleUrl && formData.useSpreadsheet}
                        onChange={() => setFormData(prev => ({ ...prev, useSingleUrl: false, useSpreadsheet: true, excelFile: null }))}
                        className="w-4 h-4"
                      />
                      <span className="text-text-dark">Googleスプレッドシート共有URL</span>
                    </label>

                    {!formData.useSingleUrl && formData.useSpreadsheet && (
                      <div className="ml-6">
                        <input
                          type="text"
                          value={formData.spreadsheetUrl}
                          onChange={(e) => {
                            // 半角英数字のみ許可
                            const value = e.target.value.replace(/[^a-zA-Z0-9:\/\.\-_?=&#%]/g, '');
                            setFormData(prev => ({ ...prev, spreadsheetUrl: value }));
                          }}
                          placeholder="https://docs.google.com/spreadsheets/..."
                          className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                            errors.spreadsheetUrl ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                          }`}
                        />
                        {errors.spreadsheetUrl && <p className="text-red-600 text-sm mt-2">{errors.spreadsheetUrl}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* お届け先情報 */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <label className="block text-lg font-bold text-text-dark mb-4">
                3. お届け先情報
              </label>

              <div className="space-y-4">
                <div>
                  <label className="block text-text-dark font-semibold mb-2">
                    会社名・団体名 <span className="text-sm text-text-medium font-normal">（任意）</span>
                  </label>
                  <input
                    type="text"
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
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                      errors.customerName ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                    }`}
                    placeholder="山田太郎"
                  />
                  {errors.customerName && <p className="text-red-600 text-sm mt-2">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-text-dark font-semibold mb-2">
                    郵便番号 <span className="text-sm text-text-medium font-normal">（任意・ハイフンなし7桁）</span>
                  </label>
                  <div className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9\-]*"
                        value={formData.postalCode}
                        onChange={(e) => handlePostalCodeChange(e.target.value)}
                        maxLength={8}
                        className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                          errors.postalCode ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                        }`}
                        placeholder="1234567"
                      />
                      {errors.postalCode && <p className="text-red-600 text-sm mt-2">{errors.postalCode}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddressToPostalCode}
                      className="flex items-center gap-2 px-4 py-2 bg-accent-light hover:bg-accent text-white font-bold rounded-lg transition-colors whitespace-nowrap h-[42px]"
                    >
                      <MdSearch className="text-lg" />
                      住所から検索
                    </button>
                  </div>

                  {/* 郵便番号候補 */}
                  {postalCodeSuggestions.length > 0 && (
                    <div className="mt-3 bg-gradient-to-r from-primary-light/20 to-primary/10 rounded-lg p-4">
                      <p className="text-text-dark font-semibold mb-2 text-sm">郵便番号候補（クリックして選択）：</p>
                      <div className="flex flex-wrap gap-2">
                        {postalCodeSuggestions.map((code, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, postalCode: code }));
                              setPostalCodeSuggestions([]);
                            }}
                            className="px-4 py-2 bg-white hover:bg-accent-light hover:text-white border-2 border-primary-light rounded-lg font-semibold transition-colors"
                          >
                            〒{code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-dark font-semibold mb-2">
                      都道府県 <span className="text-accent-light">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.prefecture}
                      onChange={(e) => setFormData(prev => ({ ...prev, prefecture: e.target.value }))}
                      className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                        errors.prefecture ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                      }`}
                      placeholder="東京都"
                    />
                    {errors.prefecture && <p className="text-red-600 text-sm mt-2">{errors.prefecture}</p>}
                  </div>

                  <div>
                    <label className="block text-text-dark font-semibold mb-2">
                      市区町村 <span className="text-accent-light">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                        errors.city ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                      }`}
                      placeholder="渋谷区"
                    />
                    {errors.city && <p className="text-red-600 text-sm mt-2">{errors.city}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-text-dark font-semibold mb-2">
                    番地 <span className="text-accent-light">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                      errors.address ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                    }`}
                    placeholder="1-2-3"
                  />
                  {errors.address && <p className="text-red-600 text-sm mt-2">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-text-dark font-semibold mb-2">
                    建物名・部屋番号 <span className="text-sm text-text-medium font-normal">（任意）</span>
                  </label>
                  <input
                    type="text"
                    value={formData.building}
                    onChange={(e) => setFormData(prev => ({ ...prev, building: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-primary-light rounded-lg text-text-dark focus:outline-none focus:border-accent-light"
                    placeholder="○○ビル4F"
                  />
                </div>

                {/* Google Map */}
                {mapAddress && (
                  <div className="mt-6">
                    <label className="block text-text-dark font-semibold mb-2">
                      配送先地図の確認
                    </label>
                    <GoogleMap
                      address={mapAddress}
                      className="w-full h-64 md:h-96 rounded-lg overflow-hidden border-2 border-primary-light"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-dark font-semibold mb-2">
                      電話番号 <span className="text-accent-light">*</span> <span className="text-sm text-text-medium font-normal">（ハイフンなし半角数字）</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/[^0-9]/g, '') }))}
                      className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                        errors.phone ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                      }`}
                      placeholder="09012345678"
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-2">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-text-dark font-semibold mb-2">
                      メールアドレス <span className="text-accent-light">*</span> <span className="text-sm text-text-medium font-normal">（半角英数字）</span>
                    </label>
                    <input
                      type="email"
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
                </div>
              </div>
            </div>

            {/* お支払い方法 */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <label className="block text-lg font-bold text-text-dark mb-4">
                4. お支払い方法 <span className="text-accent-light">*</span>
              </label>

              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-primary-light/10"
                    style={{ borderColor: formData.paymentMethod === 'card' ? '#ff6f4d' : '#ffdb47' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                      className="w-5 h-5"
                    />
                    <div>
                      <span className="text-text-dark font-semibold">クレジットカード決済</span>
                      <p className="text-sm text-text-medium mt-1">Visa, Mastercard, JCB, American Express対応</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-primary-light/10"
                    style={{ borderColor: formData.paymentMethod === 'bank_transfer' ? '#ff6f4d' : '#ffdb47' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank_transfer' }))}
                      className="w-5 h-5"
                    />
                    <div>
                      <span className="text-text-dark font-semibold">銀行振込</span>
                      <p className="text-sm text-text-medium mt-1">請求書を発行します（お支払い期限：14日以内）</p>
                    </div>
                  </label>
                </div>

                {/* 請求書情報（銀行振込選択時のみ表示） */}
                {formData.paymentMethod === 'bank_transfer' && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary-light/20 to-primary/10 rounded-lg">
                    <h3 className="text-text-dark font-bold mb-4">請求書情報</h3>

                    <div className="space-y-4">
                      {/* お届け先住所を使用チェックボックス */}
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.useDeliveryAddressForInvoice}
                          onChange={(e) => {
                            const useDelivery = e.target.checked;
                            setFormData(prev => ({
                              ...prev,
                              useDeliveryAddressForInvoice: useDelivery,
                              invoiceCompanyName: useDelivery ? prev.companyName : prev.invoiceCompanyName,
                              invoiceContactName: useDelivery ? prev.customerName : prev.invoiceContactName,
                              invoicePostalCode: useDelivery ? prev.postalCode : prev.invoicePostalCode,
                              invoiceAddress: useDelivery ? `${prev.prefecture}${prev.city}${prev.address}${prev.building ? ' ' + prev.building : ''}` : prev.invoiceAddress
                            }));
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-text-dark">お届け先情報と同じ</span>
                      </label>

                      <p className="text-sm text-text-medium">
                        ※ 会社名か担当者名のどちらか一方は必須です
                      </p>

                      <div>
                        <label className="block text-text-dark font-semibold mb-2">
                          会社名（御中） <span className="text-sm text-text-medium font-normal">（法人の場合）</span>
                        </label>
                        <input
                          type="text"
                          value={formData.useDeliveryAddressForInvoice ? formData.companyName : formData.invoiceCompanyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, invoiceCompanyName: e.target.value }))}
                          disabled={formData.useDeliveryAddressForInvoice}
                          className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none border-primary-light focus:border-accent-light ${formData.useDeliveryAddressForInvoice ? 'bg-gray-100' : ''}`}
                          placeholder="株式会社○○"
                        />
                      </div>

                      <div>
                        <label className="block text-text-dark font-semibold mb-2">
                          担当者名（様） <span className="text-sm text-text-medium font-normal">（個人または担当者）</span>
                        </label>
                        <input
                          type="text"
                          value={formData.useDeliveryAddressForInvoice ? formData.customerName : formData.invoiceContactName}
                          onChange={(e) => setFormData(prev => ({ ...prev, invoiceContactName: e.target.value }))}
                          disabled={formData.useDeliveryAddressForInvoice}
                          className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                            errors.invoiceContactName ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                          } ${formData.useDeliveryAddressForInvoice ? 'bg-gray-100' : ''}`}
                          placeholder="山田太郎"
                        />
                        {errors.invoiceContactName && <p className="text-red-600 text-sm mt-2">{errors.invoiceContactName}</p>}
                      </div>

                      <div>
                        <label className="block text-text-dark font-semibold mb-2">
                          郵便番号 <span className="text-accent-light">*</span> <span className="text-sm text-text-medium font-normal">（ハイフンなし7桁）</span>
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formData.useDeliveryAddressForInvoice ? formData.postalCode : formData.invoicePostalCode}
                          onChange={(e) => handleInvoicePostalCodeChange(e.target.value)}
                          disabled={formData.useDeliveryAddressForInvoice}
                          maxLength={7}
                          className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                            errors.invoicePostalCode ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                          } ${formData.useDeliveryAddressForInvoice ? 'bg-gray-100' : ''}`}
                          placeholder="1234567"
                        />
                        {!formData.useDeliveryAddressForInvoice && (
                          <p className="text-text-medium text-xs mt-1">※ 7桁入力で住所を自動入力します</p>
                        )}
                        {errors.invoicePostalCode && <p className="text-red-600 text-sm mt-2">{errors.invoicePostalCode}</p>}
                      </div>

                      <div>
                        <label className="block text-text-dark font-semibold mb-2">
                          請求書送付先住所 <span className="text-accent-light">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.useDeliveryAddressForInvoice ? `${formData.prefecture}${formData.city}${formData.address}${formData.building ? ' ' + formData.building : ''}` : formData.invoiceAddress}
                          onChange={(e) => setFormData(prev => ({ ...prev, invoiceAddress: e.target.value }))}
                          disabled={formData.useDeliveryAddressForInvoice}
                          className={`w-full px-4 py-2 border-2 rounded-lg text-text-dark focus:outline-none ${
                            errors.invoiceAddress ? 'border-red-600 focus:border-red-600' : 'border-primary-light focus:border-accent-light'
                          } ${formData.useDeliveryAddressForInvoice ? 'bg-gray-100' : ''}`}
                          placeholder="東京都渋谷区○○1-2-3 ○○ビル4F"
                        />
                        {!formData.useDeliveryAddressForInvoice && (
                          <p className="text-text-medium text-xs mt-1">※ 番地・建物名を追記してください</p>
                        )}
                        {errors.invoiceAddress && <p className="text-red-600 text-sm mt-2">{errors.invoiceAddress}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 備考・ご要望 */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <label className="block text-lg font-bold text-text-dark mb-4">
                5. 備考・ご要望 <span className="text-sm text-text-medium font-normal">（任意）</span>
              </label>

              <div>
                <textarea
                  rows={4}
                  value={formData.remarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-primary-light rounded-lg text-text-dark focus:outline-none focus:border-accent-light"
                  placeholder="その他ご要望があればご記入ください"
                />
              </div>
            </div>

            {/* 利用規約・プライバシーポリシー */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-light/30">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                  className="w-5 h-5 flex-shrink-0"
                />
                <span className="text-text-dark">
                  <Link href="/legal/terms" target="_blank" className="text-accent-light hover:underline">利用規約</Link>
                  および
                  <Link href="/legal/privacy" target="_blank" className="text-accent-light hover:underline">プライバシーポリシー</Link>
                  に同意します <span className="text-accent-light">*</span>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-600 text-sm mt-2">{errors.agreeToTerms}</p>}
            </div>

            {/* ボタン */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isFormComplete()}
                className={`inline-flex items-center justify-center gap-2 font-bold py-4 px-12 rounded-full text-lg transition-colors shadow-lg ${
                  isFormComplete()
                    ? 'bg-accent-light hover:bg-accent text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <MdShoppingCart className="text-2xl" />
                注文内容を確認
              </button>
              {!isFormComplete() && (
                <p className="text-text-medium text-sm mt-3">
                  ※ 必須項目をすべて入力してください
                </p>
              )}
            </div>

            <p className="text-center text-text-medium text-sm">
              ※ 確認画面で内容をご確認後、注文を確定してください。
            </p>
          </form>
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
