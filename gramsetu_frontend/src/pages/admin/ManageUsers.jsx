import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Users,
  UserCheck,
  MapPin,
  Phone,
  Home,
  Eye,
  Pencil,
  Trash2,
  X
} from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const[searchQuery,setSearchQuery]= useState("");


  // Modal tracking states for deep profile lookups
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);



 

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    houseNumber: "",
    area: "",
    role: "CITIZEN",
    address: ""
  });

  const fetchUsers = () => {
    setLoading(true);
    API.get("/api/users").then((res) => setUsers(res.data)).catch((err) => {
      console.error("failed to sync resident database:", err);
      setError("Failed to reterive user directory.");
    }).finally(() => setLoading(false));




  };

  useEffect(() => {
    fetchUsers();
  }, []);





  const openDossier = (user) => {
    setSelectedUser(user);
    setIsEditMode(false);
    setIsModalOpen(true);
  };


  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      mobileNumber: user.mobileNumber || "", 
      role: user.role || "CITIZEN",
      houseNumber: user.houseNumber || "",
      area: user.area || "",
      address: user.address || ""
    });

    setIsEditMode(true);
    setIsModalOpen(true);

  }

  const closeDossier = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
    setIsEditMode(false)

  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you absolute sure you want to permanently delete this user record ?")) return;

    setError("");
    setSuccess("");
    setActioningId(id);

    try {
      await API.delete(`/api/users/${id}`);
      setSuccess("Resident entry permanently deleted from system.");
      setUsers((prev) => prev.filter((u) => u.id !== id));


    } catch (err) {
      console.error("Deletion error:", err);
      setError("Failed to process delete command signal.");

    } finally {
      setActioningId(null);
    }

  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setActioningId(selectedUser.id);

    try {
      await API.put(`/api/users/${selectedUser.id}`, formData);
      setSuccess("Identity attributes updated successfully.");
      closeDossier();
      fetchUsers();
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to commit profile updates.");
    } finally {
      setActioningId(null);
    }

  };
   const filteredUsers= users.filter((user)=>{
    const query = searchQuery.toLowerCase();
   
  const userName = user.name?.toLowerCase() || "";
  const userMobile = (user.mobileNumber || user.mobile || "").toString();
  const userHouse = user.houseNumber?.toLowerCase() || "";

  return userName.includes(query) || userMobile.includes(query) || userHouse.includes(query);
  })


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

      {/* 🔍 Dynamic Search Bar Section */}
      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name, mobile, or house number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200/90 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none placeholder-gray-400 transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* System Toast Alerts */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3.5 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold p-3.5 rounded-xl">
          {success}
        </div>
      )}

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
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 text-sm">
                      No verified matching residents found in this directory partition.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
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
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wide uppercase ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                          user.role === 'WATERMAN' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            'bg-gray-50 text-gray-700 border border-gray-200/60'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openDossier(user)}
                            disabled={actioningId !== null}
                            className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-gray-200 hover:border-emerald-200 transition duration-150 text-xs disabled:opacity-40"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            disabled={actioningId !== null}
                            className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold px-3 py-1.5 rounded-xl border border-blue-100 transition duration-150 text-xs disabled:opacity-40"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            disabled={actioningId !== null}
                            className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold px-3 py-1.5 rounded-xl border border-rose-100 transition duration-150 text-xs disabled:opacity-40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over Profile Modal Component Overlay */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl border max-w-md w-full shadow-xl overflow-hidden transform transition-all scale-100">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                {isEditMode ? <Pencil className="w-5 h-5 text-blue-600" /> : <Users className="w-5 h-5 text-emerald-600" />}
                <h3 className="font-extrabold text-gray-900 text-base">
                  {isEditMode ? "Modify Resident Info" : "Unified Citizen Profile"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeDossier}
                className="p-1.5 hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 rounded-lg transition"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Body */}
            {isEditMode ? (
              <form onSubmit={handleUpdateSubmit}>
                <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Mobile Number</label>
                    <input
                      type="text"
                      required
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Assigned Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="RESIDENT">RESIDENT</option>
                      <option value="WATERMAN">WATERMAN</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">House Number</label>
                    <input
                      type="text"
                      required
                      value={formData.houseNumber}
                      onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Area / Ward Block</label>
                    <input
                      type="text"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Detailed Address (Optional)</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeDossier}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actioningId === selectedUser.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition disabled:opacity-50"
                  >
                    {actioningId === selectedUser.id ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="p-6 space-y-5">
                  {/* Profile Avatar Card Hero */}
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg font-black shadow-sm shadow-emerald-600/20">
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-gray-900">{selectedUser.name}</h4>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">Database Reference: #{selectedUser.id}</p>
                    </div>
                  </div>

                  {/* Attributes Vectors Details Layout */}
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
                    type="button"
                    onClick={closeDossier}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
                  >
                    Close Audit Session
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export  default ManageUsers;