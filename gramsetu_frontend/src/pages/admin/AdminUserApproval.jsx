import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
    CheckCircle,
    Search,
    ShieldCheck,
    UserCheck,
    UserX,
    Clock,
    AlertTriangle,
    Mail,
    UserCheck2
} from "lucide-react";


const AdminUserApproval = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actioningId, setActioningId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchPendingUsers = async () => {
        setLoading(true);
        try {
            const res = await API.get("/api/auth/pending");
            setPendingUsers(res.data);
        } catch (err) {
            console.error("Error fetching pending users:", err);
            setError("Failed to retrieve the verification ledger from server.");


        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleApprove = async (id) => {
        setError("");
        setSuccess("");
        setActioningId(id);

        try {
            await API.put(`/api/auth/approve/${id}`);
            setSuccess("Villager account status mutated to APPROVED successfully.");
            setPendingUsers((prev) => prev.filter((user) => user.id !== id));

        } catch (err) {
            console.error("Approval error :", err);
            setError("Failed to transmit approval transaction signal.");
        } finally {
            setActioningId(null);
        }
    };


    const handleReject = async (is) => {
        if (!window.confirm("Are you absolute sure you want to permenantaly delete and reject this registration entry?")) return;

        setError("");
        setSuccess("");
        setActioningId(id);

        try {
            await API.delete(`/api/admin/reject/${id}`);
            setSuccess("Registration record dropped and eliminated from database safely.");
            setPendingUsers((prev) => prev.filter((user) => user.id !== id));

        } catch (err) {
            console.error("Rejection error:", err);
            setError("Failed to transmit drop-record payload.");
        } finally {
            setActioningId(null);
        }
    };

    const filteredUsers = pendingUsers.filter((u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 py-4">
      
      {/* 1. Page Header Frame */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Pending Identity Verification
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Review incoming resident accounts, audit enrollment requests, and manage access parameters.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0">
          <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
          <div className="text-xs">
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Awaiting Review</p>
            <p className="text-gray-800 font-extrabold">{pendingUsers.length} Registrations</p>
          </div>
        </div>
      </div>

      {/* Status Notifications */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 2. Controls & Search Utility Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by candidate name or contact email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
        </div>
        
        <div className="text-xs text-gray-400 font-semibold shrink-0">
          Showing {filteredUsers.length} of {pendingUsers.length} unverified rows
        </div>
      </div>

      {/* 3. Main Data Stream Render Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white border rounded-2xl space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-400">Querying active validation pools...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center space-y-3">
          <div className="w-12 h-12 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center mx-auto text-gray-300">
            <UserCheck2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
            {searchTerm ? "No search queries fit current query." : "Clear Ledger! All villagers verified."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <th className="py-4 px-6">System Identity Block</th>
                  <th className="py-4 px-6">Email Coordinate Address</th>
                  <th className="py-4 px-6 text-center">Verification Security State</th>
                  <th className="py-4 px-6 text-right">Commit Pipeline Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 font-bold text-sm rounded-lg flex items-center justify-center transition-colors border border-gray-200/40">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-extrabold text-gray-900 text-sm tracking-tight">{user.name}</p>
                          <p className="text-[10px] font-mono text-gray-400">UID Key: #{user.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase bg-amber-50 border-amber-200 text-amber-700">
                        <Clock className="w-3 h-3" />
                        <span>Unverified Block</span>
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(user.id)}
                          disabled={actioningId !== null}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 disabled:opacity-40 text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Approve Access</span>
                        </button>
                        
                        <button
                          onClick={() => handleReject(user.id)}
                          disabled={actioningId !== null}
                          className="bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 disabled:opacity-40 text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Reject Entry</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Verification Stamp Footer */}
      <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium text-gray-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Central Identity Management Access Control Pipeline</span>
        </div>
        <p className="text-[10px] tracking-wider uppercase font-bold text-gray-300">GramSetu Security-Auth v1.0</p>
      </div>

    </div>
  );
};

export default AdminUserApproval;


