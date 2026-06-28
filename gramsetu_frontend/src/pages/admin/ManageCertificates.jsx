import { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  ShieldCheck, 
  FileCheck, 
  ExternalLink,
  User,
  Activity,
  Award
} from "lucide-react";

const statusColors = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  UNDER_VERIFICATION: "bg-blue-50 text-blue-700 border-blue-200",
  APPROVED: "bg-teal-50 text-teal-700 border-teal-200",
  GENERATED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};

const ManageCertificates = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const res = await API.get("/api/certificates/admin/all");
      setApplications(res.data);
    } catch (err) {
      console.error("Backoffice fetching error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const verifyApplications = async (id) => {
    try {
      await API.put(`/api/certificates/${id}/verify`, {});
      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Verification workflow routing failed.");
    }
  };

  const approveApplications = async (id) => {
    try {
      await API.put(`/api/certificates/${id}/approve`, {});
      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Application authorization signature failed.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "GENERATED": return <Award className="w-3.5 h-3.5" />;
      case "APPROVED": return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "UNDER_VERIFICATION": return <Clock className="w-3.5 h-3.5" />;
      case "REJECTED": return <XCircle className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 p-1">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
            Certificate Backoffice Registry
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Audit validation logs, authorize signature steps, and control issued public documentation indexes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-white px-3 py-2 border border-gray-200/80 rounded-xl shadow-sm w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Active Pipeline: {applications.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm font-medium animate-pulse">
          <Activity className="animate-spin h-5 w-5 mr-3 text-gray-500" />
          Synchronizing validation queues...
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl text-gray-400 text-sm shadow-sm flex flex-col items-center justify-center">
          <FileText className="w-10 h-10 text-gray-300 mb-3" />
          <p className="font-bold text-gray-900">Queue Cleared</p>
          <p className="text-xs text-gray-400 mt-0.5">No digital certificate filings are currently waiting for approval.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200/60 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">ID & Token</th>
                  <th className="p-4">Applicant Profile</th>
                  <th className="p-4">Classification</th>
                  <th className="p-4">Status & Timeline</th>
                  <th className="p-4">Audit Trace Logs</th>
                  <th className="p-4">Repository Files</th>
                  <th className="p-4 pr-6 text-right">Pipeline Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/40 transition-colors align-top group">
                    
                    {/* ID & Token */}
                    <td className="p-4 pl-6 space-y-1">
                      <div className="font-mono text-xs font-semibold text-gray-400">#{app.id}</div>
                      {app.certificateNumber ? (
                        <div className="font-mono text-[10px] bg-gray-50 text-gray-800 px-1.5 py-0.5 rounded-md font-bold border border-gray-200 w-fit tracking-wide">
                          {app.certificateNumber}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Applicant Details */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-bold text-gray-900">{app.userName || "Unknown User"}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium font-mono">
                        Filed: {formatDate(app.appliedDate)}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="p-4">
                      <span className="inline-flex items-center text-xs font-extrabold tracking-wider text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        {app.certificateType}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4 space-y-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${statusColors[app.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {getStatusIcon(app.status)}
                        {app.status?.replace("_", " ")}
                      </span>
                      {app.generatedAt && (
                        <div className="text-[11px] text-gray-400 font-mono">Issued: {formatDate(app.generatedAt)}</div>
                      )}
                    </td>

                    {/* Audit & Log Remarks */}
                    <td className="p-4 max-w-xs whitespace-normal space-y-1.5">
                      {app.verificationRemarks && (
                        <div className="text-xs text-gray-600 leading-relaxed">
                          <span className="font-bold text-gray-400 uppercase text-[10px] tracking-tight block">[Verify]</span> 
                          {app.verificationRemarks}
                        </div>
                      )}
                      {app.approvalRemarks && (
                        <div className="text-xs text-gray-600 leading-relaxed">
                          <span className="font-bold text-gray-400 uppercase text-[10px] tracking-tight block">[Approve]</span> 
                          {app.approvalRemarks}
                        </div>
                      )}
                      {app.rejectionRemarks && (
                        <div className="text-xs text-rose-600 font-medium leading-relaxed">
                          <span className="font-bold text-rose-400 uppercase text-[10px] tracking-tight block">[Reject]</span> 
                          {app.rejectionRemarks}
                        </div>
                      )}
                      {!app.verificationRemarks && !app.approvalRemarks && !app.rejectionRemarks && (
                        <span className="text-xs text-gray-400 italic">No notes logged</span>
                      )}
                    </td>

                    {/* File URLs */}
                    <td className="p-4 space-y-1.5">
                      {app.documentUrl && (
                        <div>
                          <a 
                            href={app.documentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 group/link"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>User Proof Docs</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      )}
                      {app.generatedCertificateUrl && (
                        <div>
                          <a 
                            href={`${API.defaults.baseURL || ""}/${app.generatedCertificateUrl}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 hover:text-emerald-800 font-extrabold inline-flex items-center gap-1 group/link"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Official Certificate</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {app.status === "PENDING" && (
                          <button
                            onClick={() => verifyApplications(app.id)}
                            className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                          >
                            Verify
                          </button>
                        )}
                        {(app.status === "PENDING" || app.status === "UNDER_VERIFICATION") && (
                          <button
                            onClick={() => approveApplications(app.id)}
                            className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                          >
                            Approve
                          </button>
                        )}
                        {app.status !== "PENDING" && app.status !== "UNDER_VERIFICATION" && (
                          <span className="text-xs text-gray-400 font-medium italic pr-2">Processed</span>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCertificates;