import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Shield, User, Droplets, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Unified path resolver logic (Fixed missing forward slashes and spelling typos)
  const getDashboardPath = () => {
    if (!user?.role) return "/login";
    switch (user.role.toUpperCase()) {
      case "ADMIN": 
        return "/admin/dashboard";
      case "WATERMAN": 
        return "/waterman/dashboard";
      default: 
        return "/citizen/dashboard";
    }
  };

  // Dynamic helper to match sub-roles with professional micro icons
  const getRoleIcon = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN": 
        return <Shield className="w-3 h-3 text-purple-600" />;
      case "WATERMAN": 
        return <Droplets className="w-3 h-3 text-blue-600" />;
      default: 
        return <User className="w-3 h-3 text-emerald-600" />;
    }
  };

  // Dynamic style compiler for the role badges
  const getRoleBadgeClass = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN": 
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      case "WATERMAN": 
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      default: 
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-white/95">
      
      {/* Brand Identity Branding Logo Section */}
      <div 
        onClick={() => navigate(getDashboardPath())} 
        className="flex items-center gap-3 cursor-pointer select-none group"
      >
        <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/10 group-hover:scale-105 transition duration-200">
          <span className="font-black text-xl tracking-tight">G</span>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg text-gray-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">
            GramSetu
          </span>
          <span className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest uppercase">
            पंचायत डिजिटल मंच
          </span>
        </div>
      </div>

      {/* Dynamic Profile Session Actions Node */}
      {user && (
        <div className="flex items-center gap-5">
          
          {/* User Profile Info Card */}
          <div className="flex items-center gap-3 border-r border-gray-100 pr-5 hidden sm:flex">
            <div className="text-right">
              <p className="font-bold text-sm text-gray-900 leading-tight">
                {user.name}
              </p>
              <div className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider mt-1 ${getRoleBadgeClass(user.role)}`}>
                {getRoleIcon(user.role)}
                <span>{user.role}</span>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Action Blocks */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate(getDashboardPath())}
              className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold px-3 py-2 rounded-xl text-xs border border-gray-200/70 transition"
              title="Go to Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Dashboard</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-rose-50 text-gray-700 hover:text-rose-600 font-bold px-3 py-2 rounded-xl text-xs border border-gray-200 hover:border-rose-200 transition shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;