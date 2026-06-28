import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const actions = [
    { title: "Property & Water Taxes", desc: "View pending dues and billing history", path: "/citizen/taxes", icon: "💰", color: "from-blue-50 to-indigo-50 border-blue-100 text-blue-700" },
    { title: "Grievance Redressal", desc: "File new complaints & monitor updates", path: "/citizen/complaints", icon: "📝", color: "from-amber-50 to-orange-50 border-amber-100 text-amber-700" },
    { title: "Certificate Requests", desc: "Apply for Income, Birth & Cast docs", path: "/citizen/certificates", icon: "📜", color: "from-purple-50 to-fuchsia-50 border-purple-100 text-purple-700" },
    { title: "Public Broadcasts", desc: "Official updates from the Sarpanch", path: "/citizen/notifications", icon: "📢", color: "from-emerald-50 to-teal-50 border-emerald-100 text-emerald-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome, {user?.name || "Citizen"} 👋</h1>
          <p className="text-gray-500 mt-1">Access your village administrative services online directly.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-800 text-sm font-medium px-4 py-2 rounded-xl border border-emerald-100">
          📍 Gram Panchayat Resident Profile
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.path)}
            className={`bg-gradient-to-br ${item.color} p-5 rounded-2xl border cursor-pointer hover:shadow-md transition transform hover:-translate-y-0.5 flex flex-col justify-between h-44`}
          >
            <div className="text-3xl">{item.icon}</div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.title}</h3>
              <p className="text-gray-600 text-xs mt-1 leading-normal">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitizenDashboard;