import { useState, useEffect } from "react";
import API from "../../api/axios";

const TaxPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/taxes/my").then(res => setTaxes(res.data)).catch(err => console.error("Error loading tax bills", err)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tax Invoices & Dues</h2>
        <p className="text-gray-500 text-sm">Review your pending structural development and civic utility bills.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading invoice registries...</div>
      ) : taxes.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center text-gray-500 shadow-sm">
          🎉 Great job! No pending dues linked to this registered phone number.
        </div>
      ) : (
        <div className="grid gap-4">
          {taxes.map((tax) => (
            <div key={tax.id} className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${tax.status === "PAID" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {tax.status}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{tax.taxType} Bill</h3>
                <p className="text-xs text-gray-400 font-mono mt-1">Invoice Reference: #{tax.id}</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-none pt-3 sm:pt-0">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Cost</p>
                  <p className="text-2xl font-black text-gray-900">₹{tax.amount}</p>
                </div>
                {tax.status === "PENDING" && (
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow transition">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

};

export default TaxPage;