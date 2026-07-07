
import { useState, useEffect } from "react";
import API from "../../api/axios";
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Calendar,
  FileText,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

const TaxPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/taxes/my")
      .then((res) => setTaxes(res.data))
      .catch((err) => console.error("Error loading tax bills:", err))
      .finally(() => setLoading(false));
  }, []);


  const handleRazorpayPayment = async (tax) => {
    try {
      const orderResponse = await API.post("/api/payments/create-order", {
        amount: tax.amount,
      });

      const { id: orderId, amount, currency } = orderResponse.data;


      const options = {
        key: "rzp_test_TAGHgMwt5e7CMl",
        amount: amount,
        currency: currency,
        name: "Gramsetu",
        description: `${formatTaxType(tax.taxType)} Payment`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verificationPayload = {
              taxId: tax.id,
              amount: tax.amount,
              transcationId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            const verifyRes = await API.post("/api/payments/verify-payment", verificationPayload);

            if (verifyRes.status == 201 || verifyRes.data.status === "SUCCESS") {
              alert("🎉 Payment Successful! Your invoice has been settled.")


              setTaxes((prevTaxes) =>
                prevTaxes.map((t) => (t.id === tax.id ? { ...t, status: "PAID" } : t))
              );
            }
          } catch (err) {
            console.error("Payment verification failure context:", err);
            alert("Signature reconciliation rejected by server.");

          }
        }
        , prefill: {
          name: tax.userName || "Villager",
          email: "citizen@gramsetu.in",

        },
        theme: {
          color: "#059669",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Failed to kick off runtime payment workflow:", error);
      alert("Could not initialize transaction with the banking gateway.");

    }

  };
  // Helper mapping to transform raw system names into localized text strings
  const formatTaxType = (type) => {
    const types = {
      GHARPATTI: "Gharpatti (Property Tax)",
      PANIPATTI: "Panipatti (Water Tax)",
      PROPERTY_TAX: "Property Tax",
      WATER_TAX: "Water Tax",
    };
    return types[type] || type;
  };

  // Status utility handler for visual badges and color weights
  const getStatusMeta = (status) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return {
          bg: "bg-emerald-50 border-emerald-100 text-emerald-700",
          icon: CheckCircle2,
          label: "Settled / Paid"
        };
      case "UNPAID":
      case "PENDING":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-700",
          icon: HelpCircle,
          label: "Action Required"
        };
      case "OVERDUE":
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-700",
          icon: AlertTriangle,
          label: "Overdue Notice"
        };
      default:
        return {
          bg: "bg-gray-50 border-gray-200 text-gray-600",
          icon: HelpCircle,
          label: status
        };
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-2 py-4">

      {/* 1. Page Header Frame */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Tax Invoices & Dues</h2>
          <p className="text-gray-500 text-sm font-medium">
            Review, track, and clear your pending structural development and civic utility liabilities.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <div className="text-xs">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Invoiced Items</p>
            <p className="text-gray-800 font-extrabold">{taxes.length} Statements Listed</p>
          </div>
        </div>
      </div>

      {/* 2. Primary Loading / Render Flow Pipelines */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border rounded-2xl space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-400">Fetching local village ledger accounts...</p>
        </div>
      ) : taxes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">No Outstanding Liabilities</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Excellent job! No pending municipal tax assessment invoices are connected to your profile context details.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {taxes.map((tax) => {
            const statusMeta = getStatusMeta(tax.status);
            const StatusIcon = statusMeta.icon;

            return (
              <div
                key={tax.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* Left Metadata Block Context */}
                <div className="space-y-3 w-full md:w-auto">
                  <div className="flex items-center gap-2.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${statusMeta.bg}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusMeta.label}</span>
                    </span>
                    <span className="text-xs font-mono text-gray-400">REF: #{tax.id}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                      {formatTaxType(tax.taxType)}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <span>Assessed to: <b className="text-gray-700">{tax.userName}</b></span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 font-medium pt-1 border-t border-gray-50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Due Date: <b className="text-gray-600">{tax.dueDate || "N/A"}</b>
                    </span>
                    {tax.createdAt && (
                      <span className="hidden sm:inline-flex items-center gap-1">
                        Issued: <b className="text-gray-500">{new Date(tax.createdAt).toLocaleDateString()}</b>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Transaction Actions Panel */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  <div className="text-left md:text-right space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Assessment Charge</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">₹{tax.amount?.toFixed(2)}</p>
                  </div>

                  {tax.status !== "PAID" ? (
                    <button
                      onClick={() => handleRazorpayPayment(tax)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Bill</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-xs font-bold select-none">
                      <Receipt className="w-4 h-4 text-gray-400" />
                      <span>Invoice Closed</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 3. Transaction Guarantee Note Footer */}
      <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium text-gray-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>BBPS Network Aggregated Payment Endpoint</span>
        </div>
        <p className="text-[10px] tracking-wider uppercase font-bold text-gray-300">GramSetu FinNode v1.0</p>
      </div>

    </div>
  );
};

export default TaxPage;