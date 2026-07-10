import { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  FileText, 
  CheckCircle2, 
  User, 
  UserX, 
  AlertCircle, 
  Clock, 
  Eye,
  X,
  Calendar,
  Layers,
  ExternalLink,
  Search,
  SlidersHorizontal
} from "lucide-react";

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Tab Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL"); // Options: "ALL", "SUBMITTED", "RESOLVED"

  // Modal Drawer View States
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadComplaints = () => {
    setLoading(true);
    API.get("/api/complaints")
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Grievance synchronization failure:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleResolve = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await API.put(`/api/complaints/${id}`, { status: "RESOLVED" });
      
      if (selectedComplaint && selectedComplaint.id === id) {
        setSelectedComplaint(prev => ({ ...prev, status: "RESOLVED" }));
      }
      loadComplaints();
    } catch (err) {
      console.error("Resolution update pipeline dropped:", err);
      alert("Failed to update grievance resolution index.");
    }
  };

  const openInspectionModal = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const closeInspectionModal = () => {
    setSelectedComplaint(null);
    setIsModalOpen(false);
  };

  // Helper mapping helper logic cleanly for visual states
  const getStatusMeta = (status) => {
    switch (status?.toUpperCase()) {
      case "RESOLVED":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: CheckCircle2,
          label: "Resolved"
        };
      case "IN_PROGRESS":
      case "UNDER_REVIEW":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-100",
          icon: Clock,
          label: "Under Review"
        };
      case "SUBMITTED":
      default:
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-100",
          icon: AlertCircle,
          label: "Submitted"
        };
    }
  };

  // 🔍 COMPUTED FILTERING MATRIX (Search + Tab filtering combinatorics)
  const filteredComplaints = complaints.filter((c) => {
    // 1. Tab Filtering Match Block
    if (activeTab !== "ALL" && c.status?.toUpperCase() !== activeTab) {
      return false;
    }

    // 2. Search Box Filter Match Block
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchesId = c.id?.toString().includes(query);
    const matchesDesc = c.description?.toLowerCase().includes(query);
    const matchesUser = !c.anonymous && c.userName?.toLowerCase().includes(query);

    return matchesId || matchesDesc || matchesUser;
  });

  return (
    <div className="space-y-6 p-1 max-w-7xl mx-auto">
      {/* Structural Header Context Block */}
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
          Public Grievance Dispatch
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Review, analyze, and track resolution metrics for community infrastructure issues and field reports lodged by residents.
        </p>
      </div>

      {/* 🛠️ SEARCH & TABS PIPELINE BAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        
        {/* Dynamic Nav Tabs Navigation Segment */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-full sm:w-auto">
          {["ALL", "SUBMITTED", "RESOLVED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none text-xs font-bold px-4 py-2 rounded-lg tracking-wide uppercase transition-all duration-150 cursor-pointer ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/40"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab === "ALL" ? "All Registers" : tab}
            </button>
          ))}
        </div>

        {/* Dynamic Global Input Search Box Component */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tickets, names, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 border border-gray-200/90 rounded-xl text-xs bg-white font-medium shadow-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none placeholder-gray-400 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* STREAM RENDERING CONTAINER */}
      {loading ? (
        <div className="text-gray-400 text-sm py-4 animate-pulse">Syncing dynamic incident records...</div>
      ) : (
        <div className="grid gap-4">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white border border-gray-200/90 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border flex items-center justify-center text-gray-400 mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-gray-900 font-bold text-sm">No Matching Registers</p>
              <p className="text-gray-400 text-xs mt-0.5">
                {searchQuery || activeTab !== "ALL" 
                  ? "Adjust search context string query filters to extract records partitions."
                  : "No open public grievances require resolution indexing currently."}
              </p>
            </div>
          ) : (
            filteredComplaints.map((c) => {
              const meta = getStatusMeta(c.status);
              const StatusIcon = meta.icon;

              return (
                <div 
                  key={c.id} 
                  onClick={() => openInspectionModal(c)}
                  className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition duration-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 group cursor-pointer animate-fadeIn"
                >
                  <div className="flex items-start gap-4 w-full min-w-0">
                    {/* Visual File Evidence Media Node thumbnail */}
                    {c.imageUrl ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0 relative group/img bg-gray-50">
                        <img src={c.imageUrl} alt="Incident File Evidence" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}

                    <div className="space-y-1 w-full min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* Identity Logic block */}
                        {c.anonymous ? (
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                            <UserX className="w-3.5 h-3.5" />
                            <span className="italic">Anonymous Resident</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span>{c.userName}</span>
                          </div>
                        )}
                        
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${meta.bg}`}>
                          <StatusIcon className="w-2.5 h-2.5 stroke-[2.5]" />
                          {meta.label}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm max-w-2xl leading-relaxed pt-0.5 truncate">
                        {c.description}
                      </p>
                      
                      <p className="text-[10px] font-bold text-gray-400 font-mono pt-0.5 uppercase tracking-wider">
                        Filing Reference: <span className="text-gray-700">#{c.id}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions Panel layout section */}
                  <div className="w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 flex items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      className="text-xs font-bold text-gray-400 group-hover:text-gray-700 flex items-center gap-1 transition px-3 py-2 bg-gray-50 group-hover:bg-gray-100 rounded-xl cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>

                    {c.status?.toUpperCase() !== "RESOLVED" && (
                      <button
                        type="button"
                        onClick={(e) => handleResolve(c.id, e)}
                        className="w-full md:w-auto inline-flex items-center justify-center bg-gray-900 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors duration-150 whitespace-nowrap cursor-pointer"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 🔍 DETAILED AUDIT MODAL OVERLAY PORTAL */}
      {isModalOpen && selectedComplaint && (() => {
        const modalMeta = getStatusMeta(selectedComplaint.status);
        const ModalStatusIcon = modalMeta.icon;

        return (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-3xl border max-w-2xl w-full shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
              
              {/* Modal Core Header Info */}
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-gray-100 text-gray-500 rounded-lg font-mono text-xs font-black">
                    #{selectedComplaint.id}
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-base tracking-tight">
                    Incident Audit Dossier
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeInspectionModal}
                  className="p-1.5 hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 rounded-xl transition cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Modal Body Window Content Area */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Meta Summary Metrics Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Filing Authority Profile</span>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-black text-gray-800">
                      {selectedComplaint.anonymous ? (
                        <><UserX className="w-4 h-4 text-gray-400" /> <span className="italic font-medium text-gray-400">Anonymous</span></>
                      ) : (
                        <><User className="w-4 h-4 text-emerald-600" /> <span>{selectedComplaint.userName}</span></>
                      )}
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${modalMeta.bg.split(' ')[0]} ${modalMeta.bg.split(' ')[2] || 'border-gray-100'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Current Resolution Index</span>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-black uppercase">
                      <ModalStatusIcon className="w-4 h-4 stroke-[2.5]" />
                      <span>{modalMeta.label}</span>
                    </div>
                  </div>
                </div>

                {/* Main Explanation Block */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Resident Narrative & Description
                  </label>
                  <div className="bg-gray-50/60 rounded-2xl border border-gray-100 p-4 text-gray-700 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {selectedComplaint.description}
                  </div>
                </div>

                {/* Evidence Attachments Field Processing Node if populated */}
                {selectedComplaint.imageUrl && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block flex items-center justify-between">
                      <span>Field Reference Evidence File</span>
                      <a 
                        href={selectedComplaint.imageUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 hover:underline flex items-center gap-0.5 normal-case font-medium"
                      >
                        Open Original <ExternalLink className="w-3 h-3" />
                      </a>
                    </label>
                    <div className="border border-gray-200/80 rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center shadow-inner max-h-80 select-none">
                      <img 
                        src={selectedComplaint.imageUrl} 
                        alt="Incident Core Investigation Asset" 
                        className="max-w-full max-h-80 object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Technical Node Parameters Metadata Info Layout */}
                <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-500 font-medium font-mono">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Lodge Date: {new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-400" />
                    <span>System ID: GS-{selectedComplaint.id}</span>
                  </div>
                </div>
              </div>

              {/* Modal Action Controls Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeInspectionModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Close Archive View
                </button>
                {selectedComplaint.status?.toUpperCase() !== "RESOLVED" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      handleResolve(selectedComplaint.id, e);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition cursor-pointer"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ManageComplaints;