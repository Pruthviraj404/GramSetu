import { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  Users, 
  UserCheck, 
  MapPin, 
  Phone, 
  Home, 
  Eye, 
  X 
} from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal tracking states for deep profile lookups
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    API.get("/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to sync resident databases:", err))
      .finally(() => setLoading(false));
  }, []);

  const openDossier = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeDossier = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header section */}
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
          Resident Registry Management
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Secure identity authority database auditing all verified profiles and roles configured under this municipal jurisdiction.
        </p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm py-4 animate-pulse">Querying relational database records...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold text-xs border-b border-gray-200/60">
                  <th className="p-4 pl-6">Resident ID</th>
                  <th className="p-4">Full Legal Name</th>
                  <th className="p-4">Contact Channel</th>
                  <th className="p-4">Role Clearance</th>
                  <th className="p-4 text-right pr-6">Data Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/60 transition duration-150 group">
                    <td className="p-4 pl-6 font-mono text-xs text-gray-400">#{user.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                          <UserCheck className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-bold text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 font-medium font-mono">
                      +91 {user.mobileNumber || user.mobile}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wide uppercase ${
                        user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 
                        user.role === 'WATERMAN' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                        'bg-gray-50 text-gray-700 border border-gray-200/60'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => openDossier(user)}
                        className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-gray-200 hover:border-emerald-200 transition duration-150 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over Profile Modal Component Overlay */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
          <div className="bg-white rounded-2xl border max-w-md w-full shadow-xl overflow-hidden transform transition-all scale-100">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-gray-900 text-base">Unified Citizen Profile</h3>
              </div>
              <button 
                onClick={closeDossier}
                className="p-1.5 hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 rounded-lg transition"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Card Data Mapping Details */}
            <div className="p-6 space-y-5">
              {/* Profile Avatar Card Hero */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg font-black shadow-sm shadow-emerald-600/20">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-black text-gray-900">{selectedUser.name}</h4>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">Database Reference: #{selectedUser.id}</p>
                </div>
              </div>

              {/* Comprehensive Attribute Vectors Layout */}
              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Protocol Number</p>
                    <p className="font-mono font-bold text-gray-800 mt-0.5">+91 {selectedUser.mobileNumber || selectedUser.mobile}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserCheck className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned Authority Level</p>
                    <p className="font-semibold text-gray-800 mt-0.5 uppercase">{selectedUser.role}</p>
                  </div>
                </div>

                {/* Separator to segment address block details */}
                <div className="pt-2 border-t border-gray-100"></div>

                <div className="flex items-start gap-3">
                  <Home className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">House/Premises Identifier</p>
                    <p className="font-bold text-gray-800 mt-0.5">{selectedUser.houseNumber || "Not Categorized"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jurisdiction Sector / Area Block</p>
                    <p className="font-semibold text-gray-800 mt-0.5">{selectedUser.area || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Complete Core Registry Address</p>
                    <p className="font-semibold text-gray-600 mt-0.5 leading-relaxed">{selectedUser.address || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
              <button 
                onClick={closeDossier}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
              >
                Close Audit Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;