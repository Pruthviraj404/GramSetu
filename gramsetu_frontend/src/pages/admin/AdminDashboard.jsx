import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BarChart3, 
  Wrench, 
  FolderLock, 
  Megaphone,
  ArrowRight
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const metrics = [
    { 
      label: "Total Registered Villagers", 
      count: "1,420 Users", 
      link: "/admin/users", 
      icon: Users,
      iconColor: "text-blue-600 bg-blue-50 border-blue-100"
    },
    { 
      label: "Pending Tax Revenue Collection", 
      count: "₹42,500 Outstanding", 
      link: "/admin/taxes", 
      icon: BarChart3,
      iconColor: "text-amber-600 bg-amber-50 border-amber-100"
    },
    { 
      label: "Open Citizen Complaints", 
      count: "14 Escalations", 
      link: "/admin/complaints", 
      icon: Wrench,
      iconColor: "text-rose-600 bg-rose-50 border-rose-100"
    },
    { 
      label: "Pending Documentation Audits", 
      count: "8 Approvals Left", 
      link: "/admin/certificates", 
      icon: FolderLock,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
  ];

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
          Executive Command Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1.5">
          Central management console for Gram Panchayat digital workflows, system utilities, and public infrastructure records.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, i) => {
          const IconComponent = m.icon;
          return (
            <div 
              key={i} 
              className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${m.iconColor}`}>
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>
                
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {m.label}
                </p>
                <p className="text-xl font-extrabold text-gray-900 mt-1">
                  {m.count}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => navigate(m.link)} 
                  className="w-full flex items-center justify-between text-xs text-emerald-600 font-bold hover:text-emerald-700 transition-colors group/btn"
                >
                  <span>Manage Operations</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Administrative Operations Utility Control Block */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-base">
            System Administration Utilities
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Deploy mass community updates and toggle system alert notices.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate("/admin/notifications")} 
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-sm shadow-emerald-600/10"
          >
            <Megaphone className="w-4 h-4 stroke-[2.5]" />
            <span>Broadcast Central Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;