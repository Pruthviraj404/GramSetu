
import { useState, useEffect } from "react";
import API from "../../api/axios";
import { 
  FileText, 
  PlusCircle, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  History,
  CornerDownRight,
  ShieldAlert,
  EyeOff,
  Image
} from "lucide-react";

const ComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
 const [imageUrl, setImageUrl] = useState("");
 const [anonymous, setAnonymous] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchComplaints = () => {
    API.get("/api/complaints/my")
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Error fetching historical complaints:", err))
      .finally(() => setFetchLoading(false));
  };

  useEffect(() => { 
    fetchComplaints(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    setLoading(true);
    try {
      await API.post("/api/complaints", 
        {description, imageUrl:imageUrl.trim() || null, anonymous});
      
      setDescription("");
      setImageUrl("");
      setAnonymous(false);
      fetchComplaints();
    } catch (err) {
      console.error("Error submitting grievance:", err); // Fixed the 'error is not defined' catch syntax bug
    } finally {
      setLoading(false);

    }
  };

  const getStatusMeta = (status) => {
    switch (status?.toUpperCase()) {
      case "RESOLVED":
        return { bg: "bg-emerald-50 border-emerald-200 text-emerald-700", icon: CheckCircle2, label: "Resolved" };
      case "IN_PROGRESS":
      case "PROCESSING":
        return { bg: "bg-blue-50 border-blue-200 text-blue-700", icon: Clock, label: "In Progress" };
      case "PENDING":
      default:
        return { bg: "bg-amber-50 border-amber-200 text-amber-700", icon: AlertCircle, label: "Pending Review" };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 py-4">
      {/* Page Header Introduction Row */}
      <div className="space-y-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Grievance Redressal Desk</h2>
        <p className="text-gray-500 text-sm font-medium">
          Lodge institutional service requests or infrastructure feedback to notify your administrative ward supervisors directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* 1. Grievance Form Panel */}
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>File a New Grievance</span>
              </h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Submit items regarding public lighting arrays, water pipeline disruptions, waste clearance, or road structural breaks.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {/* Detailed Explanation */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Detailed Explanation
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise location markers, landmarks, or structural severity to help field inspectors triage the case efficiently..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none font-medium text-gray-800 placeholder:text-gray-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 transition-all resize-none"
                  required
                />
              </div>

              {/* Image URL Input Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                  <Image className="w-3.5 h-3.5" /> Reference Image Link (Optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none font-medium text-gray-800 placeholder:text-gray-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 transition-all"
                />
              </div>

              {/* Anonymous Toggle Option Switch */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 transition duration-150">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-gray-400" />
                  <div>
                    <label htmlFor="anonymous-toggle" className="text-xs font-bold text-gray-700 block cursor-pointer select-none">
                      File Anonymously
                    </label>
                    <span className="text-[10px] font-medium text-gray-400 block leading-tight">Hide your profile identifier</span>
                  </div>
                </div>
                <input
                  id="anonymous-toggle"
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Record...</span>
                  </>
                ) : (
                  <span>Submit Grievance Record</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* 2. Historic Lodged Complaints Log Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <History className="w-4 h-4 text-gray-400" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Your Submitted Incident Registers
            </h3>
          </div>

          {fetchLoading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-gray-400">Synchronizing history manifests...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center space-y-3">
              <div className="w-12 h-12 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center mx-auto text-gray-300">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                No logged entries discovered under this personal profile index.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {complaints.map((c) => {
                const meta = getStatusMeta(c.status);
                const StatusIcon = meta.icon;

                return (
                  <div 
                    key={c.id} 
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4 relative overflow-hidden group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
                          <CornerDownRight className="w-3 h-3 text-gray-300" />
                          <span>Incident Ticket: #{c.id}</span>
                          {c.anonymous && (
                            <span className="ml-1 px-1.5 py-0.5 bg-gray-100 border text-[9px] font-bold rounded text-gray-500 uppercase tracking-wide">
                              Anonymous
                            </span>
                          )}
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase shrink-0 select-none ${meta.bg}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{meta.label}</span>
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm font-medium leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                      {c.description}
                    </p>

                    {/* Render Image Attachments if populated */}
                    {c.imageUrl && (
                      <div className="mt-2 max-w-sm rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                        <img 
                          src={c.imageUrl} 
                          alt="Grievance attachment record reference link" 
                          className="w-full max-h-48 object-cover group-hover:scale-[1.01] transition duration-200"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider pt-1">
                      <div className="flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-gray-300" />
                        <span>Assigned to Ward Inspector Node</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintPage;