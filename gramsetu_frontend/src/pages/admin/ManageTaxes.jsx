import React, { useState, useEffect ,useRef} from "react";
import API from "../../api/axios";
import {
  Receipt,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  IndianRupee,
  Activity,
  Search,
  ChevronDown,
  ChevronUp,
  Edit2,
  BellRing
} from "lucide-react";

import toast from "react-hot-toast";

const ManageTaxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);

  const [activeTab, setActiveTab] = useState("ALL");
  const [isSendingReminders, setIsSendingReminders] = useState(false);

  const pollIntervalRef = useRef(null);

  const checkReminderStatus = async () => {
    try {
      const res =  await API.get("/api/taxes/remind-status");

      if (!res.data.isProcessing) {
        setIsSendingReminders(false);

        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;

        }

        toast.success("All pending reminder emails have been sent completely")
        fetchTaxes();

      }
    } catch (err) {
      console.error("Tracking metrics engine connection drops:", err);

    }
  }




  useEffect(() => {
    fetchTaxes();

    API.get("/api/taxes/remind-status").then((res) => {
      if (res.data.isProcessing) {
        setIsSendingReminders(true);
        if (!pollIntervalRef.current) {
          pollIntervalRef.current = setInterval(checkReminderStatus, 4000);

        }
      }
    }).catch((err) => console.error("Initial layout lock mapping fail:", err));

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);


  const fetchTaxes = () => {
    API.get("/api/taxes").then((res) => setTaxes(res.data)).catch((err) => console.error("Failed to sync finincial ledgers:", err))
      .finally(() => setLoading(false));
  }


  const handleStatusChange = (taxId, newStatus) => {

    const confirmChange = window.confirm(
      `Are you sure you want to change the status of invoice #${taxId} to ${newStatus}?`
    );


    if (!confirmChange) {
      return;
    }
    API.put(`/api/taxes/${taxId}?status=${newStatus}`).then(() => {
      fetchTaxes();
    }).catch((err) => console.error("Failed to modify invoice billing state:", err));

  };

  const handleSendTaxReminders = async () => {
    if (isSendingReminders) return;
    setIsSendingReminders(true);
    try {
      await API.post("/api/taxes/remind-pending");
      toast.success("Email engine triggered. Button will remain locked until process finishes.");

      if (!pollIntervalRef.current) {
        pollIntervalRef.current = setInterval(checkReminderStatus, 4000);
      }


    } catch (err) {
      console.error("Failed to deploy communication loops:", error);
      toast.error("Failed to dispatch reminders. Please check backend service layers.");
      setIsSendingReminders(false);


    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const groupTaxesByUser = () => {
    const groups = {};
    taxes.forEach((tax) => {
      if (activeTab === "PENDING" && tax.status !== "PENDING") return;
      if (activeTab === "PAID" && tax.status !== "PAID") return;

      const uId = tax.userId;
      if (!groups[uId]) {
        groups[uId] = {
          userId: uId,
          userName: tax.userName || "Unknown Resident",
          allBills: []
        };
      }
      groups[uId].allBills.push(tax);
    });
    return Object.values(groups);
  };

  const groupedResidents = groupTaxesByUser();

  const filteredResidents = groupedResidents.filter((resident) =>
    resident.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpandRow = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };




  return (
    <div className="space-y-6 p-1 max-w-7xl mx-auto">

      <div className="border-b border-gray-100 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
            Gram Panchayat Revenue Auditing
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Track infrastructure assessments, monitor structural tax metrics, and review unique resident billing records.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search unique residents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 placeholder-gray-400 shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200/60">
        <div className="flex items-center gap-1">
          {["ALL", "PENDING", "PAID"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setExpandedUserId(null);
              }}
              className={`text-xs font-bold px-4 py-2 rounded-lg tracking-wider uppercase transition-all duration-200 ${activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/40 font-extrabold"
                  : "text-gray-400 hover:text-gray-700 hover:bg-white/40 font-semibold"
                }`}
            >
              {tab === "ALL" && "All Registers"}
              {tab === "PENDING" && "Pending"}
              {tab === "PAID" && "Paid"}
            </button>
          ))}
        </div>

        {activeTab === "PENDING" && filteredResidents.length > 0 && (
          <button
            onClick={handleSendTaxReminders}
            disabled={isSendingReminders}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xs font-bold py-2 px-4 rounded-lg tracking-wide uppercase transition-all shadow-sm active:scale-95"
          >
            <BellRing size={14} className={isSendingReminders ? "animate-spin text-gray-400" : ""} />
            {isSendingReminders ? "Sending Mails... Button Locked" : "Send Reminders to Defaulters"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm font-medium animate-pulse">
          <Activity className="animate-spin h-5 w-5 mr-3 text-gray-500" />
          Compiling relational financial indexes...
        </div>
      ) : filteredResidents.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl text-gray-400 text-sm shadow-sm flex flex-col items-center justify-center">
          <Receipt className="w-10 h-10 text-gray-300 mb-3" />
          <p className="font-bold text-gray-900">No Records Found</p>
          <p className="text-xs text-gray-400 mt-0.5">
            No active resident bills correspond with the "{activeTab}" status conditions.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200/60 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-12"></th>
                  <th className="p-4 w-28">Resident ID</th>
                  <th className="p-4">Assigned Citizen Name</th>
                  <th className="p-4 text-center">Active Invoices Issued</th>
                  <th className="p-4 pr-6 text-right">Data Drilldown Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredResidents.map((resident) => {
                  const isExpanded = expandedUserId === resident.userId;
                  return (
                    <React.Fragment key={resident.userId}>
                      <tr
                        onClick={() => toggleExpandRow(resident.userId)}
                        className="hover:bg-gray-50/60 cursor-pointer transition-colors align-middle group font-medium"
                      >
                        <td className="p-4 pl-6 text-gray-400">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </td>
                        <td className="p-4 font-mono text-xs text-gray-400">#{resident.userId}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white transition-colors">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-gray-900">{resident.userName}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold font-mono px-2 py-0.5 rounded-md">
                            {resident.allBills.length} Invoices
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button className="text-xs text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
                            {isExpanded ? "Close Invoices" : "View Statement Breakdown"}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan="5" className="bg-gray-50/40 p-6 border-t border-b border-gray-100">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-inner overflow-hidden">
                              <table className="w-full text-left text-xs text-gray-600">
                                <thead className="bg-gray-50/80 border-b border-gray-200 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                  <tr>
                                    <th className="p-3 pl-5">Bill ID</th>
                                    <th className="p-3">Tax Variant Classification</th>
                                    <th className="p-3">Statement Value</th>
                                    <th className="p-3">Due Date Matrix</th>
                                    <th className="p-3">Current Status</th>
                                    <th className="p-3 pr-5 text-right">Manual Action Override</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium">
                                  {resident.allBills.map((bill) => (
                                    <tr key={bill.id} className="hover:bg-gray-50/30 align-middle">
                                      <td className="p-3 pl-5 font-mono text-gray-400">#{bill.id}</td>
                                      <td className="p-3">
                                        <span className="font-mono font-bold tracking-wide text-gray-700 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                                          {bill.taxType}
                                        </span>
                                      </td>
                                      <td className="p-3 font-bold text-gray-900">
                                        <div className="flex items-center gap-0.5">
                                          <IndianRupee className="w-3 h-3 stroke-[2.5]" />
                                          <span>{bill.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                        </div>
                                      </td>
                                      <td className="p-3 text-gray-500">{formatDate(bill.dueDate)}</td>
                                      <td className="p-3">
                                        <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${bill.status === "PAID"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                            : "bg-amber-50 text-amber-700 border-amber-100"
                                          }`}>
                                          {bill.status === "PAID" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                                          {bill.status}
                                        </span>
                                      </td>
                                      <td className="p-3 pr-5 text-right">
                                        <div className="inline-flex items-center gap-1.5 justify-end">
                                          <Edit2 className="w-3 h-3 text-gray-400" />
                                          <select
                                            value={bill.status}
                                            onChange={(e) => handleStatusChange(bill.id, e.target.value)}
                                            className="bg-white border border-gray-200 text-xs rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold cursor-pointer shadow-sm hover:border-gray-300"
                                          >
                                            <option value="PENDING">PENDING</option>
                                            <option value="PAID">PAID</option>
                                          </select>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTaxes;