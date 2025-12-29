"use client";

import { useState, useEffect, useMemo } from "react";
import { Order, supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import {
  MdContentCopy,
  MdEmail,
  MdCheck,
  MdLocalShipping,
  MdPending,
  MdDone,
  MdBusiness,
  MdPerson,
  MdMailOutline,
  MdPhone,
  MdLocationOn,
  MdHome,
  MdApartment,
  MdLink,
  MdNote,
  MdArrowForward,
  MdArrowBack,
  MdDownload,
  MdPayment,
  MdAccountBalance,
  MdCreditCard,
  MdReceipt,
  MdCalendarMonth,
  MdTableChart,
  MdPictureAsPdf,
  MdDelete,
} from "react-icons/md";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "processing" | "shipped" | "completed">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [viewMode, setViewMode] = useState<"orders" | "sales">("orders");

  // selectedOrderIdから注文を取得
  const selectedOrder = orders.find(order => order.id === selectedOrderId);

  // ページロード時に認証状態をチェック
  useEffect(() => {
    const authToken = localStorage.getItem('admin_auth');
    if (authToken === 'authenticated') {
      setIsAuthenticated(true);
      fetchOrders();
    }
  }, []);

  // 認証チェック
  const handleLogin = () => {
    // 簡易認証（本番環境では改善が必要）
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'authenticated');
      fetchOrders();
    } else {
      alert("パスワードが正しくありません");
    }
  };

  // ログアウト
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    setOrders([]);
  };

  // 注文一覧取得
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // ステータス更新
  const updateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // コピー機能（ビジュアルフィードバック付き）
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // 2秒後に元に戻す
  };

  // 発送完了メール送信
  const handleSendShippingEmail = async (order: Order) => {
    if (!trackingNumber.trim()) {
      alert("追跡番号を入力してください");
      return;
    }

    setSendingEmail(true);
    try {
      // ステータスを「発送済」に更新し、追跡番号を保存
      const updateResponse = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "shipped",
          tracking_number: trackingNumber,
          shipped_at: new Date().toISOString()
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("注文の更新に失敗しました");
      }

      // メール送信
      const emailResponse = await fetch("/api/send-shipping-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          quantity: order.quantity,
          trackingNumber: trackingNumber,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("メールの送信に失敗しました");
      }

      alert("発送完了メールを送信しました");
      setShowTrackingModal(false);
      setTrackingNumber("");
      fetchOrders();
    } catch (error) {
      console.error("Error sending shipping email:", error);
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setSendingEmail(false);
    }
  };

  // 入金確認処理
  const handleConfirmPayment = async (order: Order) => {
    if (!confirm(`${order.customer_name}様の注文の入金を確認しますか？\n\n確認後、入金確認メールが送信されます。`)) {
      return;
    }

    setConfirmingPayment(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "入金確認に失敗しました");
      }

      alert("入金確認が完了しました。確認メールを送信しました。");
      fetchOrders();
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setConfirmingPayment(false);
    }
  };

  // 注文削除処理
  const handleDeleteOrder = async (order: Order) => {
    const confirmMessage = `以下の注文を削除しますか？\n\n注文番号: ${order.id.slice(0, 8)}\n顧客名: ${order.customer_name}\n数量: ${order.quantity}枚\n\nこの操作は取り消せません。`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setDeletingOrder(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "注文の削除に失敗しました");
      }

      alert("注文を削除しました。");
      setSelectedOrderId(null);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setDeletingOrder(false);
    }
  };

  // 支払い方法の表示
  const getPaymentMethodLabel = (method: string | null | undefined) => {
    if (!method) return "-";
    return method === "card" ? "カード決済" : "銀行振込";
  };

  // 支払いステータスバッジ
  const getPaymentStatusBadge = (status: string | null | undefined, method: string | null | undefined) => {
    if (!method) return null;

    const statusLabel = status === "paid" ? "入金済" : status === "pending" ? "処理中" : "未入金";
    const styles = status === "paid"
      ? "bg-green-100 text-green-800"
      : status === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${styles}`}>
        {statusLabel}
      </span>
    );
  };

  // メモからURL+メモのペアを抽出
  const parseUrlMemos = (memo: string): Array<{url: string, memo: string}> => {
    // "複数URL（X件）:" で始まる場合、各URLとメモを抽出
    // 形式: "1. https://example.com (メモ)"
    const urlPattern = /\d+\.\s+([^\s(]+)(?:\s*\(([^)]+)\))?/g;
    const matches = [];
    let match;

    while ((match = urlPattern.exec(memo)) !== null) {
      matches.push({
        url: match[1].trim(),
        memo: match[2] ? match[2].trim() : ''
      });
    }

    return matches;
  };

  // 備考のみを抽出
  const extractRemarks = (memo: string): string => {
    const remarksMatch = memo.match(/備考:\s*([\s\S]+)$/);
    return remarksMatch ? remarksMatch[1].trim() : '';
  };

  // フィルタリングとソートされた注文（未処理が一番上）
  const filteredOrders = (filter === "all"
    ? orders
    : orders.filter(order => order.status === filter)
  ).sort((a, b) => {
    // ステータスの優先順位
    const statusPriority: Record<string, number> = {
      pending: 1,
      processing: 2,
      shipped: 3,
      completed: 4,
    };
    const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
    if (priorityDiff !== 0) return priorityDiff;

    // 同じステータスの場合は日付順（新しい順）
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // 月別注文フィルタリング
  const monthlyOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      const orderMonth = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
      return orderMonth === selectedMonth;
    });
  }, [orders, selectedMonth]);

  // 売上集計
  const salesSummary = useMemo(() => {
    const paidOrders = monthlyOrders.filter(o => o.payment_status === "paid");
    const cardOrders = paidOrders.filter(o => o.payment_method === "card");
    const bankOrders = paidOrders.filter(o => o.payment_method === "bank_transfer");

    return {
      totalOrders: monthlyOrders.length,
      paidOrders: paidOrders.length,
      unpaidOrders: monthlyOrders.filter(o => o.payment_status !== "paid").length,
      // 受注金額（全注文）
      totalOrderAmount: monthlyOrders.reduce((sum, o) => sum + (o.payment_amount || 0), 0),
      // 入金済み売上
      totalRevenue: paidOrders.reduce((sum, o) => sum + (o.payment_amount || 0), 0),
      cardRevenue: cardOrders.reduce((sum, o) => sum + (o.payment_amount || 0), 0),
      bankRevenue: bankOrders.reduce((sum, o) => sum + (o.payment_amount || 0), 0),
      // 数量
      totalQuantity: monthlyOrders.reduce((sum, o) => sum + o.quantity, 0),
      paidQuantity: paidOrders.reduce((sum, o) => sum + o.quantity, 0),
    };
  }, [monthlyOrders]);

  // 利用可能な月リストを生成
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    orders.forEach(order => {
      const date = new Date(order.created_at);
      months.add(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
    });
    // 現在の月も追加
    const now = new Date();
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    return Array.from(months).sort().reverse();
  }, [orders]);

  // 表示する注文リスト（ビューモードに応じて切り替え）
  const displayOrders = useMemo(() => {
    if (viewMode === "sales") {
      // 売上集計: 選択した月の注文を表示（フィルター適用）
      return (filter === "all"
        ? monthlyOrders
        : monthlyOrders.filter(order => order.status === filter)
      ).sort((a, b) => {
        const statusPriority: Record<string, number> = {
          pending: 1,
          processing: 2,
          shipped: 3,
          completed: 4,
        };
        const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    } else {
      // 注文一覧: 全注文を表示（フィルターのみ適用）
      return filteredOrders;
    }
  }, [viewMode, monthlyOrders, filteredOrders, filter]);

  // Excelエクスポート
  const exportToExcel = () => {
    const data = monthlyOrders.map(order => ({
      "注文ID": order.id,
      "注文日時": new Date(order.created_at).toLocaleString("ja-JP"),
      "顧客名": order.customer_name,
      "会社名": order.customer_company_name || "",
      "メール": order.customer_email,
      "電話番号": order.customer_phone,
      "郵便番号": order.customer_postal_code,
      "住所": `${order.customer_prefecture}${order.customer_city}${order.customer_street_address}${order.customer_building || ""}`,
      "数量": order.quantity,
      "URL": order.url,
      "支払い方法": order.payment_method === "card" ? "カード決済" : order.payment_method === "bank_transfer" ? "銀行振込" : "",
      "金額": order.payment_amount || 0,
      "入金状況": order.payment_status === "paid" ? "入金済" : order.payment_status === "pending" ? "処理中" : "未入金",
      "ステータス": order.status === "pending" ? "未処理" : order.status === "processing" ? "処理中" : order.status === "shipped" ? "発送済" : "完了",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "注文一覧");

    // 列幅を設定
    ws["!cols"] = [
      { wch: 36 }, // 注文ID
      { wch: 20 }, // 注文日時
      { wch: 15 }, // 顧客名
      { wch: 20 }, // 会社名
      { wch: 25 }, // メール
      { wch: 15 }, // 電話番号
      { wch: 10 }, // 郵便番号
      { wch: 40 }, // 住所
      { wch: 6 },  // 数量
      { wch: 40 }, // URL
      { wch: 12 }, // 支払い方法
      { wch: 10 }, // 金額
      { wch: 10 }, // 入金状況
      { wch: 10 }, // ステータス
    ];

    XLSX.writeFile(wb, `注文一覧_${selectedMonth}.xlsx`);
  };

  // PDFエクスポート（印刷用HTMLを生成）
  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("ポップアップがブロックされています。許可してください。");
      return;
    }

    const [year, month] = selectedMonth.split("-");
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>売上レポート ${year}年${month}月</title>
        <style>
          body { font-family: 'Hiragino Kaku Gothic ProN', sans-serif; padding: 20px; font-size: 12px; }
          h1 { font-size: 18px; margin-bottom: 20px; }
          .summary { margin-bottom: 30px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
          .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
          .summary-item { text-align: center; }
          .summary-label { font-size: 11px; color: #666; }
          .summary-value { font-size: 18px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f0f0f0; font-weight: bold; }
          tr:nth-child(even) { background: #fafafa; }
          .text-right { text-align: right; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>売上レポート ${year}年${month}月</h1>
        <div class="summary">
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">総注文数</div>
              <div class="summary-value">${salesSummary.totalOrders}件</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">入金済み</div>
              <div class="summary-value">${salesSummary.paidOrders}件</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">受注金額</div>
              <div class="summary-value">¥${salesSummary.totalOrderAmount.toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">入金済み売上</div>
              <div class="summary-value">¥${salesSummary.totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>注文日</th>
              <th>顧客名</th>
              <th>数量</th>
              <th>支払い方法</th>
              <th class="text-right">金額</th>
              <th>入金</th>
              <th>ステータス</th>
            </tr>
          </thead>
          <tbody>
            ${monthlyOrders.map(order => `
              <tr>
                <td>${new Date(order.created_at).toLocaleDateString("ja-JP")}</td>
                <td>${order.customer_name}</td>
                <td>${order.quantity}枚</td>
                <td>${order.payment_method === "card" ? "カード" : order.payment_method === "bank_transfer" ? "振込" : "-"}</td>
                <td class="text-right">¥${(order.payment_amount || 0).toLocaleString()}</td>
                <td>${order.payment_status === "paid" ? "済" : order.payment_status === "pending" ? "処理中" : "未"}</td>
                <td>${order.status === "pending" ? "未処理" : order.status === "processing" ? "処理中" : order.status === "shipped" ? "発送済" : "完了"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // ステータスバッジのスタイル
  const getStatusBadge = (status: Order["status"]) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
    };
    const labels = {
      pending: "未処理",
      processing: "処理中",
      shipped: "発送済",
      completed: "完了",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // 未認証の場合、ログイン画面を表示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-text-dark mb-6 text-center">
            管理画面ログイン
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            placeholder="パスワードを入力"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-accent-light text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-accent-light hover:bg-accent text-white font-bold py-3 rounded-lg transition-colors"
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-text-dark">注文管理</h1>
            <div className="flex flex-wrap items-center gap-3">
              {/* 月選択 */}
              <div className="flex items-center gap-2">
                <MdCalendarMonth className="text-xl text-gray-600" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {availableMonths.map(month => {
                    const [year, m] = month.split("-");
                    return (
                      <option key={month} value={month}>
                        {year}年{parseInt(m)}月
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* 表示モード切替 */}
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  onClick={() => setViewMode("orders")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    viewMode === "orders"
                      ? "bg-accent text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <MdTableChart className="inline mr-1" />
                  注文一覧
                </button>
                <button
                  onClick={() => setViewMode("sales")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    viewMode === "sales"
                      ? "bg-accent text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  売上集計
                </button>
              </div>

              {/* エクスポートボタン */}
              <div className="flex gap-2">
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <MdDownload />
                  Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <MdPictureAsPdf />
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 売上サマリー */}
        {viewMode === "sales" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-text-dark mb-4">
              {selectedMonth.split("-")[0]}年{parseInt(selectedMonth.split("-")[1])}月 売上サマリー
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">総注文数</p>
                <p className="text-2xl font-bold text-blue-600">{salesSummary.totalOrders}件</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">入金済</p>
                <p className="text-2xl font-bold text-green-600">{salesSummary.paidOrders}件</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">未入金</p>
                <p className="text-2xl font-bold text-yellow-600">{salesSummary.unpaidOrders}件</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">総枚数</p>
                <p className="text-2xl font-bold text-orange-600">{salesSummary.totalQuantity}枚</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">受注金額</p>
                <p className="text-2xl font-bold text-gray-700">¥{salesSummary.totalOrderAmount.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">入金済み売上</p>
                <p className="text-2xl font-bold text-purple-600">¥{salesSummary.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">カード売上</p>
                <p className="text-2xl font-bold text-indigo-600">¥{salesSummary.cardRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">振込売上</p>
                <p className="text-2xl font-bold text-teal-600">¥{salesSummary.bankRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "全て", icon: MdDone },
              { key: "pending", label: "未処理", icon: MdPending },
              { key: "processing", label: "処理中", icon: MdCheck },
              { key: "shipped", label: "発送済", icon: MdLocalShipping },
              { key: "completed", label: "完了", icon: MdDone },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                  filter === key
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchOrders()}
              className="bg-accent-light hover:bg-accent text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
            >
              更新
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* 注文一覧 */}
        {loading ? (
          <div className="text-center py-12">読み込み中...</div>
        ) : displayOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-900">
            {viewMode === "sales" ? `${selectedMonth.split("-")[0]}年${parseInt(selectedMonth.split("-")[1])}月の注文がありません` : "注文がありません"}
          </div>
        ) : selectedOrderId ? (
          // 詳細表示
          (() => {
            const order = orders.find(o => o.id === selectedOrderId);
            if (!order) return null;
            return (
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="mb-6 flex items-center gap-2 bg-accent-light hover:bg-accent text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
                >
                  <MdArrowBack className="text-xl" />
                  一覧に戻る
                </button>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-text-dark">
                      注文 #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {new Date(order.created_at).toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as Order["status"])}
                    className="px-3 py-1 border-2 border-primary rounded-lg font-bold text-black"
                  >
                    <option value="pending">未処理</option>
                    <option value="processing">処理中</option>
                    <option value="shipped">発送済</option>
                    <option value="completed">完了</option>
                  </select>
                </div>

                {/* 支払い情報 */}
                {order.payment_method && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-text-dark border-b pb-2 mb-3 flex items-center gap-2">
                      <MdPayment className="text-xl" />
                      支払い情報
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">支払い方法</p>
                        <p className="font-bold text-gray-900 flex items-center gap-1">
                          {order.payment_method === "card" ? (
                            <MdCreditCard className="text-blue-600" />
                          ) : (
                            <MdAccountBalance className="text-green-600" />
                          )}
                          {getPaymentMethodLabel(order.payment_method)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">入金状況</p>
                        <p className="font-bold">
                          {getPaymentStatusBadge(order.payment_status, order.payment_method)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">金額</p>
                        <p className="font-bold text-gray-900">
                          ¥{(order.payment_amount || 0).toLocaleString()}
                        </p>
                      </div>
                      {order.payment_date && (
                        <div>
                          <p className="text-sm text-gray-600">入金日</p>
                          <p className="font-bold text-gray-900">
                            {new Date(order.payment_date).toLocaleDateString("ja-JP")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 請求書情報（銀行振込の場合） */}
                    {order.payment_method === "bank_transfer" && order.invoice_number && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-2">請求書情報</p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                            {order.invoice_number}
                          </span>
                          <a
                            href={`/api/generate-invoice?orderId=${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-accent hover:text-accent-light text-sm font-bold"
                          >
                            <MdReceipt />
                            請求書を表示
                          </a>
                        </div>
                      </div>
                    )}

                    {/* 入金確認ボタン（銀行振込で未入金の場合） */}
                    {order.payment_method === "bank_transfer" && order.payment_status !== "paid" && (
                      <div className="mt-4 pt-4 border-t">
                        <button
                          onClick={() => handleConfirmPayment(order)}
                          disabled={confirmingPayment}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          <MdCheck />
                          {confirmingPayment ? "処理中..." : "入金を確認"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                  {/* 注文情報 */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-text-dark border-b pb-2">注文情報</h4>
                    <div>
                      <p className="text-sm text-gray-700">数量</p>
                      <p className="font-bold text-gray-900">{order.quantity}枚</p>
                    </div>

                    {/* URL/メモ表示 */}
                    {(() => {
                      // 10枚以下：個別表示
                      if (order.quantity <= 10 && order.memo && order.memo.includes('複数URL')) {
                        const urlMemos = parseUrlMemos(order.memo);
                        const remarks = extractRemarks(order.memo);

                        return (
                          <div className="space-y-3">
                            {urlMemos.map((item, index) => (
                              <div key={index}>
                                {/* 番号 */}
                                <div className="font-bold text-gray-900 mb-1">{index + 1}</div>
                                <div className="border-t mb-2"></div>

                                {/* URL */}
                                <div className="flex items-center gap-2 mb-2">
                                  <MdLink className="text-xl text-gray-600 flex-shrink-0" />
                                  <p className="font-mono text-sm break-all flex-1 text-gray-900">{item.url}</p>
                                  <button
                                    onClick={() => copyToClipboard(item.url, `${order.id}-url-${index}`)}
                                    className="text-accent hover:text-accent-light flex-shrink-0 transition-colors"
                                  >
                                    {copiedId === `${order.id}-url-${index}` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                                  </button>
                                </div>

                                {/* メモ */}
                                {item.memo && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <MdNote className="text-xl text-gray-600 flex-shrink-0" />
                                    <p className="text-sm flex-1 text-gray-900">{item.memo}</p>
                                    <button
                                      onClick={() => copyToClipboard(item.memo, `${order.id}-memo-${index}`)}
                                      className="text-accent hover:text-accent-light flex-shrink-0 transition-colors"
                                    >
                                      {copiedId === `${order.id}-memo-${index}` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                                    </button>
                                  </div>
                                )}

                                <div className="border-t mt-2"></div>
                              </div>
                            ))}

                            {/* 備考 */}
                            {remarks && (
                              <div className="mt-4 p-3 bg-gray-50 rounded">
                                <p className="text-sm font-bold text-gray-700 mb-1">備考</p>
                                <p className="text-sm text-gray-900">{remarks}</p>
                              </div>
                            )}
                          </div>
                        );
                      }

                      // 単一URL（全て同じURL）の場合
                      else if (order.memo && order.memo.includes('全てのシールに同じURL')) {
                        const remarks = extractRemarks(order.memo);
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <MdLink className="text-xl text-gray-600 flex-shrink-0" />
                              <p className="font-mono text-sm break-all flex-1 text-gray-900">{order.url}</p>
                              <button
                                onClick={() => copyToClipboard(order.url, `${order.id}-url`)}
                                className="text-accent hover:text-accent-light flex-shrink-0 transition-colors"
                              >
                                {copiedId === `${order.id}-url` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                              </button>
                            </div>

                            {/* 備考 */}
                            {remarks && (
                              <div className="mt-4 p-3 bg-gray-50 rounded">
                                <p className="text-sm font-bold text-gray-700 mb-1">備考</p>
                                <p className="text-sm text-gray-900">{remarks}</p>
                              </div>
                            )}
                          </div>
                        );
                      }

                      // 11枚以上：Excel/スプレッドシート
                      else if (order.quantity > 10) {
                        const hasExcelFile = order.excel_file_path;
                        const isSpreadsheet = order.memo && order.memo.includes('スプレッドシートURL:');

                        // スプレッドシートURLを抽出
                        let spreadsheetUrl = '';
                        if (isSpreadsheet && order.memo) {
                          const match = order.memo.match(/スプレッドシートURL:\s*(.+?)(\n|$)/);
                          if (match) {
                            spreadsheetUrl = match[1].trim();
                          }
                        }

                        // Excelダウンロード処理
                        const handleExcelDownload = async () => {
                          if (!order.excel_file_path) return;

                          try {
                            const { data, error } = await supabase.storage
                              .from('order-files')
                              .download(order.excel_file_path);

                            if (error) throw error;

                            // ファイル名を抽出
                            const fileName = order.excel_file_path.split('/').pop() || 'download.xlsx';

                            // ダウンロード
                            const url = URL.createObjectURL(data);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = fileName;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          } catch (error) {
                            console.error('Download error:', error);
                            alert('ファイルのダウンロードに失敗しました');
                          }
                        };

                        return (
                          <div className="space-y-3">
                            <p className="text-sm text-gray-700">URL情報（11枚以上）</p>
                            <div className="flex gap-2">
                              {hasExcelFile && (
                                <button
                                  onClick={handleExcelDownload}
                                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                  <MdDownload />
                                  エクセルデータ
                                </button>
                              )}
                              {isSpreadsheet && spreadsheetUrl && (
                                <button
                                  onClick={() => copyToClipboard(spreadsheetUrl, `${order.id}-spreadsheet`)}
                                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                  {copiedId === `${order.id}-spreadsheet` ? (
                                    <>
                                      <MdCheck />
                                      コピー済
                                    </>
                                  ) : (
                                    <>
                                      <MdContentCopy />
                                      スプレッドシート
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>

                  {/* 顧客情報 */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-text-dark border-b pb-2">顧客情報</h4>

                    {/* 住所セクション */}
                    <div>
                      {/* 郵便番号 */}
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                        <MdLocationOn className="text-xl text-gray-600 flex-shrink-0" />
                        <p className="flex-1 text-gray-900">{order.customer_postal_code}</p>
                        <button
                          onClick={() => copyToClipboard(order.customer_postal_code, `${order.id}-postal`)}
                          className="text-accent hover:text-accent-light flex-shrink-0 transition-colors"
                        >
                          {copiedId === `${order.id}-postal` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                        </button>
                      </div>

                      {/* 都道府県 */}
                      {order.customer_prefecture && (
                        <div className="flex items-center gap-2 mb-2 ml-7">
                          <p className="flex-1 text-gray-900">{order.customer_prefecture}</p>
                          <button
                            onClick={() => copyToClipboard(order.customer_prefecture, `${order.id}-prefecture`)}
                            className="text-yellow-600 hover:text-yellow-700 flex-shrink-0 transition-colors"
                          >
                            {copiedId === `${order.id}-prefecture` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                          </button>
                        </div>
                      )}

                      {/* 市区町村 */}
                      <div className="mb-2 pb-2 border-b">
                        {order.customer_city && (
                          <div className="flex items-center gap-2 ml-7">
                            <p className="flex-1 text-gray-900">{order.customer_city}</p>
                            <button
                              onClick={() => copyToClipboard(order.customer_city, `${order.id}-city`)}
                              className="text-yellow-600 hover:text-yellow-700 flex-shrink-0 transition-colors"
                            >
                              {copiedId === `${order.id}-city` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 番地 */}
                      {order.customer_street_address && (
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                          <MdHome className="text-lg text-gray-600 flex-shrink-0" />
                          <p className="flex-1 text-gray-900">{order.customer_street_address}</p>
                          <button
                            onClick={() => copyToClipboard(order.customer_street_address, `${order.id}-street`)}
                            className="text-accent hover:text-accent-light flex-shrink-0 transition-colors"
                          >
                            {copiedId === `${order.id}-street` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                          </button>
                        </div>
                      )}

                      {/* 建物名 */}
                      {order.customer_building && (
                        <div className="flex items-center gap-2 mb-1">
                          <MdApartment className="text-lg text-gray-600 flex-shrink-0" />
                          <p className="flex-1 text-gray-900">{order.customer_building}</p>
                          <button
                            onClick={() => copyToClipboard(order.customer_building!, `${order.id}-building`)}
                            className="text-accent hover:text-accent-light flex-shrink-0 transition-colors"
                          >
                            {copiedId === `${order.id}-building` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                          </button>
                        </div>
                      )}

                      {/* 一括コピー */}
                      <button
                        onClick={() => {
                          const fullAddress = `〒${order.customer_postal_code}\n${order.customer_prefecture || ''}${order.customer_city || ''}${order.customer_street_address || ''}${order.customer_building ? ' ' + order.customer_building : ''}`;
                          copyToClipboard(fullAddress, `${order.id}-fulladdress`);
                        }}
                        className={`mt-0.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                          copiedId === `${order.id}-fulladdress`
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {copiedId === `${order.id}-fulladdress` ? '✓ コピー済' : '住所一括コピー'}
                      </button>
                    </div>

                    {/* 会社名 */}
                    {order.customer_company_name && (
                      <div className="flex items-center gap-2 py-2 border-t border-b">
                        <MdBusiness className="text-xl text-gray-600 flex-shrink-0" />
                        <p className="flex-1 text-gray-900">{order.customer_company_name}</p>
                        <button
                          onClick={() => copyToClipboard(order.customer_company_name!, `${order.id}-company`)}
                          className="text-accent hover:text-accent-light flex-shrink-0 transition-colors"
                        >
                          {copiedId === `${order.id}-company` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                        </button>
                      </div>
                    )}

                    {/* お名前 */}
                    <div className="flex items-center gap-2">
                      <MdPerson className="text-xl text-gray-600 flex-shrink-0" />
                      <p className="flex-1 text-gray-900">{order.customer_name}</p>
                      <button
                        onClick={() => copyToClipboard(order.customer_name, `${order.id}-name`)}
                        className="text-accent hover:text-accent-light flex-shrink-0 transition-colors"
                      >
                        {copiedId === `${order.id}-name` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                      </button>
                    </div>

                    {/* 区切り線 */}
                    <div className="border-t pt-2 mt-2"></div>

                    {/* メールアドレス */}
                    <div className="flex items-center gap-2">
                      <MdMailOutline className="text-xl text-gray-600 flex-shrink-0" />
                      <p className="flex-1 text-gray-900 font-mono text-sm">{order.customer_email}</p>
                      <button
                        onClick={() => copyToClipboard(order.customer_email, `${order.id}-email`)}
                        className="text-yellow-600 hover:text-yellow-700 flex-shrink-0 transition-colors"
                      >
                        {copiedId === `${order.id}-email` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                      </button>
                    </div>

                    {/* 電話番号 */}
                    <div className="flex items-center gap-2">
                      <MdPhone className="text-xl text-gray-600 flex-shrink-0" />
                      <p className="flex-1 text-gray-900 font-mono">{order.customer_phone}</p>
                      <button
                        onClick={() => copyToClipboard(order.customer_phone, `${order.id}-phone`)}
                        className="text-yellow-600 hover:text-yellow-700 flex-shrink-0 transition-colors"
                      >
                        {copiedId === `${order.id}-phone` ? <MdCheck className="text-green-600" /> : <MdContentCopy />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-2 pt-4 border-t justify-between">
                  <button
                    onClick={() => setShowTrackingModal(true)}
                    className="flex items-center gap-2 bg-accent-light hover:bg-accent text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
                  >
                    <MdEmail />
                    発送完了メール送信
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order)}
                    disabled={deletingOrder}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <MdDelete />
                    {deletingOrder ? "削除中..." : "注文を削除"}
                  </button>
                </div>
              </div>
            );
          })()
        ) : (
          // 一覧表示
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">注文日時</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">顧客名</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">枚数</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">支払い</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">入金</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">ステータス</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">操作</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(order.created_at).toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-bold">
                      {order.customer_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {order.quantity}枚
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        {order.payment_method === "card" ? (
                          <MdCreditCard className="text-blue-600" />
                        ) : order.payment_method === "bank_transfer" ? (
                          <MdAccountBalance className="text-green-600" />
                        ) : null}
                        {getPaymentMethodLabel(order.payment_method)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getPaymentStatusBadge(order.payment_status, order.payment_method)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrderId(order.id);
                        }}
                        className="flex items-center gap-1 text-accent hover:text-accent-light font-bold text-sm transition-colors"
                      >
                        詳細
                        <MdArrowForward className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 追跡番号入力モーダル */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">発送完了メール送信</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">注文番号: {selectedOrder.id}</p>
              <p className="text-sm text-gray-600 mb-2">顧客名: {selectedOrder.customer_name}</p>
              <p className="text-sm text-gray-600 mb-4">メール: {selectedOrder.customer_email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                追跡番号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="例: 123456789012"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900"
                disabled={sendingEmail}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTrackingModal(false);
                  setTrackingNumber("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={sendingEmail}
              >
                キャンセル
              </button>
              <button
                onClick={() => handleSendShippingEmail(selectedOrder)}
                className="flex-1 px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={sendingEmail || !trackingNumber.trim()}
              >
                {sendingEmail ? "送信中..." : "送信"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
