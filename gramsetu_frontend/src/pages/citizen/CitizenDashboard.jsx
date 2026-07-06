import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  FileText,
  FileCheck,
  Megaphone,
  ArrowUpRight,
  User,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Loader2
} from "lucide-react";
import API from "../../api/axios";

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();


  const [metrics, setMetrics] = useState({
    pendingTaxCount: 0,
    totalPendingAmount: 0.0,
    paidTaxCount: 0,
    totalPaymentsMade: 0,
    totalAmountPaid: 0.0,
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    totalCertificationApplications: 0,
    approvedCertificates: 0,
    pendingCertificates: 0,
    recentNotifications: [],
    pendingTaxes: [],
    recentPayments: [],
    recentComplaints: [],
    recentCertificates: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const res = await API.get("/api/dashboard/citizen");
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to rehydrate citizen metrics topology:", error);

      } finally {
        setLoading(false);
      }
    };
    fetchDashboardMetrics();


  }, []);

  const actions = [
    {
      title: "Property & Water Taxes",
      desc: "View pending assessments, compute current dues, and access historical payment receipts.",
      path: "/citizen/taxes",
      icon: Wallet,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      accent: "hover:border-blue-300 hover:shadow-blue-50"
    },
    {
      title: "Grievance Redressal",
      desc: "File formal complaints directly to your ward representative and track systemic resolution status.",
      path: "/citizen/complaints",
      icon: FileText,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      accent: "hover:border-amber-300 hover:shadow-amber-50"
    },
    {
      title: "Certificate Requests",
      desc: "Submit digital applications for official institutional documentation including Income, Birth, and Caste records.",
      path: "/citizen/certificates",
      icon: FileCheck,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      accent: "hover:border-purple-300 hover:shadow-purple-50"
    },
    {
      title: "Public Broadcasts",
      desc: "Monitor official village mandates, upcoming Gram Sabha assemblies, and notices from the Sarpanch.",
      path: "/citizen/notifications",
      icon: Megaphone,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      accent: "hover:border-emerald-300 hover:shadow-emerald-50"
    },
  ];

  // Micro-metrics overview array (Mock values for design representation—link to backend counters later)
  const statistics = [
    { label: "Pending Tax Bills", value: "₹2,450", subtext: "Due in 12 days", color: "text-rose-600" },
    { label: "Active Grievances", value: "1", subtext: "Under review by admin", color: "text-amber-600" },
    { label: "Processed Documents", value: "3", subtext: "Ready for download", color: "text-emerald-600" },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Loading Live Gram Panchayat Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 py-4">

      {/* Header Hero Panel */}
      <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-40 h-40 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 text-xs font-semibold text-emerald-800">
              <Building2 className="w-3.5 h-3.5" />
              <span>GramSetu Digital Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Welcome, {user?.name || "Citizen"} 👋
            </h1>
            <p className="text-sm text-gray-500 max-w-xl font-medium leading-relaxed">
              Access localized public utilities, manage property liabilities, and maintain direct communications with your Gram Panchayat administrative framework.
            </p>
          </div>

          {/* Quick Info Badge */}
          <div className="w-full md:w-auto shrink-0 bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row md:flex-col gap-4 text-xs font-semibold text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Registered Area</p>
                <p className="text-gray-800 font-bold">{user?.area || "Ward No. 1"}</p>
              </div>
            </div>
            <div className="hidden sm:block md:hidden border-l border-gray-200 h-8" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">House Profile</p>
                <p className="text-gray-800 font-bold">{user?.houseNumber || "Not Assigned"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Dynamic Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Metric 1: Outstanding Tax Dues */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Pending Tax Dues</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600 tracking-tight">
              ₹{metrics.totalPendingAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-medium text-gray-400">({metrics.pendingTaxCount} pending bills)</span>
          </div>
        </div>

        {/* Metric 2: Open Complaints */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Active Grievances</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 tracking-tight">
              {metrics.pendingComplaints}
            </span>
            <span className="text-xs font-medium text-gray-400">Awaiting Admin Action</span>
          </div>
        </div>

        {/* Metric 3: Certificates */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Processed Certificates</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 tracking-tight">
              {metrics.approvedCertificates}
            </span>
            <span className="text-xs font-medium text-gray-400">Out of {metrics.totalCertificationApplications} applied</span>
          </div>
        </div>

      </div>

      {/* Operational Grid System */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Administrative Actions</h2>
          <p className="text-xs text-gray-500 mt-0.5">Select a service branch below to initialize request logs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(item.path)}
                className={`group bg-white border border-gray-200 p-6 rounded-2xl cursor-pointer hover:shadow-md transition-all duration-200 flex items-start gap-5 relative ${item.accent}`}
              >
                <div className={`p-3.5 rounded-xl border shrink-0 transition-colors ${item.color}`}>
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="space-y-1.5 pr-6">
                  <h3 className="font-bold text-gray-900 text-lg tracking-tight group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="absolute right-5 top-6 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150">
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portal Verification Footer */}
      <div className="border-t border-gray-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-gray-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secured Administrative Connection Profile</span>
        </div>
        <p className="text-[11px]">System Node ID: GS-2026-CITIZEN</p>
      </div>

    </div>
  );
};

export default CitizenDashboard;