import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BarChart3,
  Wrench,
  FolderLock,
  Megaphone,
  ArrowRight,
  Droplets,
  ShieldCheck,
  LayoutDashboard,
  UserCheck2,
  Loader2
} from "lucide-react";
import API from "../../api/axios";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    totalCitizens: 0,
    totalWatermen: 0,
    totalTaxRecords: 0,
    pendingTaxCount: 0,
    paidTaxCount: 0,
    totalTaxCollection: 0.0,
    totalPendingDues: 0.0,
    totalComplaints: 0,
    submittedComplaints: 0,
    underReviewComplaints: 0,
    resolvedComplaints: 0,
    totalCertificateApplications: 0,
    pendingCertificates: 0,
    underVerificationCertificates: 0,
    approvedCertificates: 0,
    generatedCertificates: 0,
    rejectedCertificates: 0,
    totalPayments: 0,
    totalRevenueCollected: 0.0,
    recentComplaints: [],
    recentCertificateApplications: [],
    recentNotifications: []

  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAdminMetrics = async () => {
      try {
        const res = await API.get("/api/dashboard/admin");
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to rehydrate administrative metrics topology:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminMetrics();
  }, []);


  
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Loading Live Administrative Architecture...</p>
      </div>
    );
  }

  
 const statCards = [
    {
      label: "Total Registered Villagers",
      count: `${((metrics.totalCitizens || 0) + (metrics.totalWatermen || 0)).toLocaleString('en-IN')} Users`,
      subtext: `${metrics.totalWatermen || 0} Staff (Watermen)`,
      link: "/admin/users",
      icon: Users,
      iconColor: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      label: "Pending Tax Revenue",
      count: `₹${(metrics.totalPendingDues || 0).toLocaleString('en-IN')}`,
      subtext: `₹${(metrics.totalTaxCollection || 0).toLocaleString('en-IN')} Collected`,
      link: "/admin/taxes",
      icon: BarChart3,
      iconColor: "text-amber-600 bg-amber-50 border-amber-100"
    },
    {
      label: "Open Citizen Complaints",
      count: `${(metrics.submittedComplaints || 0) + (metrics.underReviewComplaints || 0)} Escalations`,
      subtext: `${metrics.resolvedComplaints || 0} Resolved items`,
      link: "/admin/complaints",
      icon: Wrench,
      iconColor: "text-rose-600 bg-rose-50 border-rose-100"
    },
    {
      label: "Pending Certificate Audits",
      count: `${(metrics.pendingCertificates || 0) + (metrics.underVerificationCertificates || 0)} Applications`,
      subtext: `${metrics.approvedCertificates || 0} Approved`,
      link: "/admin/certificates",
      icon: FolderLock,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
  ];


  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 py-4">

      {/* 1. Page Header Frame */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Executive Command Dashboard
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Central management console for Gram Panchayat digital workflows, system utilities, and public infrastructure records.
          </p>
        </div>

        {/* System Node Identifier Badge */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0 text-white">
          <LayoutDashboard className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Access Scope</p>
            <p className="font-mono font-bold text-emerald-400">Root Admin Node</p>
          </div>
        </div>
      </div>

      {/* 2. Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((m, i) => {
          const IconComponent = m.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${m.iconColor}`}>
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>

                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {m.label}
                </p>
                <p className="text-xl font-extrabold text-gray-900 tracking-tight mt-1">
                  {m.count}
                </p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  {m.subtext}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigate(m.link)}
                  className="w-full flex items-center justify-between text-xs text-emerald-600 font-bold hover:text-emerald-700 transition-colors group/btn cursor-pointer"
                >
                  <span>Manage Operations</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Administrative Operations Utility Control Block */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="space-y-0.5">
          <h3 className="font-extrabold text-gray-900 text-base">
            System Administration Utilities
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Deploy mass community announcements, handle citizen credential validation pools, and dispatch system alert infrastructure arrays.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          {/* Identity Verification Control Link */}
          <button
            onClick={() => navigate("/admin/approval")}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
          >
            <UserCheck2 className="w-4 h-4 text-emerald-400 stroke-[2.2]" />
            <span>Verify Pending Users</span>
          </button>

          {/* Broadcast Alert */}
          <button
            onClick={() => navigate("/admin/notifications")}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
          >
            <Megaphone className="w-4 h-4 stroke-[2.2]" />
            <span>Broadcast Central Alert</span>
          </button>

          {/* Dispatch Water Alert */}
          <button
            onClick={() => navigate("/admin/notifications")}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-blue-700 border border-gray-200 font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
          >
            <Droplets className="w-4 h-4 text-blue-500 stroke-[2.2]" />
            <span>Dispatch Water Alert</span>
          </button>
        </div>
      </div>

      {/* 4. Verification Stamp Footer */}
      <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium text-gray-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secure Administrative Management Dashboard Endpoint</span>
        </div>
        <p className="text-[10px] tracking-wider uppercase font-bold text-gray-300">GramSetu Core v1.0</p>
      </div>

    </div>
  );
};

export default AdminDashboard;