import { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  FileText, 
  CheckCircle2, 
  User, 
  UserX, 
  AlertCircle, 
  Clock, 
  Eye 
} from "lucide-react";

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = () => {
    setLoading(true);
    API.get("/api/complaints")
      .then((res) => setUsersAndComplaints(res.data))
      .catch((err) => console.error("Grievance synchronization failure:", err))
      .finally(() => setLoading(false));
  };

  // Safe wrapper to handle data updates seamlessly
  const setUsersAndComplaints = (data) => {
    setComplaints(data);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleResolve = async (id) => {
    try {
      // Adjusted path matrix based on standard REST design principles
      await API.put(`/api/complaints/${id}`, { status: "RESOLVED" });
      loadComplaints();
    } catch (err) {
      console.error("Resolution update pipeline dropped:", err);
      alert("Failed to update grievance resolution index.");
    }
  };

  // Modern status badge helper mapping components elegantly
  const getStatusBadge = (status) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 tracking-wide uppercase">
            <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
            Resolved
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 tracking-wide uppercase">
            <Clock className="w-3 h-3 stroke-[2.5]" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 tracking-wide uppercase">
            <AlertCircle className="w-3 h-3 stroke-[2.5]" />
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-1">
      {/* Structural Header Context Block */}
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
          Public Grievance Dispatch
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Review, analyze, and track resolution metrics for community infrastructure issues and field reports lodged by residents.
        </p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm py-4 animate-pulse">Syncing dynamic incident records...</div>
      ) : (
        <div className="grid gap-4">
          {complaints.length === 0 ? (
            <div className="bg-white border border-gray-200/90 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border flex items-center justify-center text-gray-400 mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-gray-900 font-bold text-sm">All Clear Logged</p>
              <p className="text-gray-400 text-xs mt-0.5">No open public grievances require resolution indexing currently.</p>
            </div>
          ) : (
            complaints.map((c) => (
              <div 
                key={c.id} 
                className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition duration-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 group"
              >
                <div className="flex items-start gap-4">
                  {/* File Attachment Visual Node Handler */}
                  {c.imageUrl ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0 relative group/img">
                      <img src={c.imageUrl} alt="Incident File Evidence" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition cursor-pointer">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-white transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Identity Protection Logic Block */}
                      {c.anonymous ? (
                        <div className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-lg border border-gray-100">
                          <UserX className="w-3.5 h-3.5" />
                          <span className="italic tracking-tight">Anonymous Resident</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span>{c.userName}</span>
                        </div>
                      )}
                      
                      {getStatusBadge(c.status)}
                    </div>
                    
                    <p className="text-gray-600 text-sm max-w-2xl leading-relaxed pt-0.5">
                      {c.description}
                    </p>
                    
                    <p className="text-[11px] font-bold text-gray-400 font-mono pt-1 uppercase tracking-wider">
                      Filing Reference: <span className="text-gray-900">#{c.id}</span>
                    </p>
                  </div>
                </div>

                {/* Operations Actions Layout */}
                {c.status !== "RESOLVED" && (
                  <div className="w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 flex justify-end shrink-0">
                    <button
                      onClick={() => handleResolve(c.id)}
                      className="w-full md:w-auto inline-flex items-center justify-center bg-gray-900 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors duration-150 whitespace-nowrap"
                    >
                      Mark as Resolved
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageComplaints;