import { useState, useEffect } from "react";
import API from "../../api/axios";
import { 
  Receipt, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Calendar,
  IndianRupee,
  Activity
} from "lucide-react";

const ManageTaxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/taxes")
      .then((res) => setTaxes(res.data))
      .catch((err) => console.error("Failed to sync financial ledgers:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 p-1">
      {/* Structural Header Context Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
            Gram Panchayat Revenue Auditing
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Track infrastructure assessments, monitor structural tax metrics, and manage community billing portfolios.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-sm shadow-emerald-600/10 shrink-0">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Generate New Invoice Run</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm font-medium animate-pulse">
          <Activity className="animate-spin h-5 w-5 mr-3 text-gray-500" />
          Compiling relational financial indexes...
        </div>
      ) : taxes.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl text-gray-400 text-sm shadow-sm flex flex-col items-center justify-center">
          <Receipt className="w-10 h-10 text-gray-300 mb-3" />
          <p className="font-bold text-gray-900">Ledger Clear</p>
          <p className="text-xs text-gray-400 mt-0.5">No tax evaluation items are recorded in the accounting cache.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200/60 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Invoice ID</th>
                  <th className="p-4">Assigned Citizen</th>
                  <th className="p-4">Tax Variant Classification</th>
                  <th className="p-4">Statement Value</th>
                  <th className="p-4">Due Date Matrix</th>
                  <th className="p-4 pr-6 text-right">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {taxes.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/40 transition-colors align-middle group">
                    
                    {/* Invoice ID */}
                    <td className="p-4 pl-6 font-mono text-xs text-gray-400">
                      #{t.id}
                    </td>
                    
                    {/* Assigned Citizen */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white transition-colors">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-gray-900">{t.userName || "Unknown Resident"}</span>
                      </div>
                    </td>
                    
                    {/* Tax Variant */}
                    <td className="p-4">
                      <span className="inline-flex items-center font-mono text-xs font-bold tracking-wide text-gray-700 bg-gray-50 border border-gray-200/60 px-2.5 py-1 rounded-lg">
                        {t.taxType}
                      </span>
                    </td>
                    
                    {/* Statement Value */}
                    <td className="p-4">
                      <div className="flex items-center gap-0.5 font-extrabold text-gray-900">
                        <IndianRupee className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{t.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </td>
                    
                    {/* Due Date */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(t.dueDate)}</span>
                      </div>
                    </td>
                    
                    {/* Payment Status Badge */}
                    <td className="p-4 pr-6 text-right">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                        t.status === "PAID" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>
                        {t.status === "PAID" ? (
                          <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                        ) : (
                          <AlertCircle className="w-3 h-3 stroke-[2.5]" />
                        )}
                        <span>{t.status}</span>
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTaxes;