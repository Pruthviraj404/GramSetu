
import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Home,
  Coins,
  Baby,
  FileSpreadsheet,
  UploadCloud,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  XCircle
} from "lucide-react";

const statusColors = {
  PENDING: "bg-amber-50 border-amber-200 text-amber-700",
  UNDER_VERIFICATION: "bg-yellow-50 border-yellow-200 text-yellow-800",
  APPROVED: "bg-blue-50 border-blue-200 text-blue-700",
  GENERATED: "bg-emerald-50 border-emerald-200 text-emerald-700",
  REJECTED: "bg-rose-50 border-rose-200 text-rose-700",
};

const statusIcons = {
  PENDING: Clock,
  UNDER_VERIFICATION: RefreshCw,
  APPROVED: CheckCircle,
  GENERATED: CheckCircle,
  REJECTED: XCircle,
};

const certificateTypes = [
  { id: "RESIDENCE", name: "Residence Certificate", icon: Home, desc: "Proof of village residency" },
  { id: "INCOME", name: "Income Certificate", icon: Coins, desc: "Official income assessment" },
  { id: "BIRTH", name: "Birth Certificate", icon: Baby, desc: "Gram Panchayat birth registry" },
  { id: "DEATH", name: "Death Certificate", icon: FileSpreadsheet, desc: "Gram Panchayat death registry" },
];

const CertificatePage = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMyCertificates = () => {
    setLoading(true);
    API.get("/api/certificates/my")
      .then((res) => setCerts(res.data))
      .catch((err) => console.error("Error fetching certificates:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMyCertificates();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only secure PDF documents are accepted.");
      setSelectedFile(null);
      e.target.value = null;
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Document payload size limit exceeded (Max 5MB).");
      setSelectedFile(null);
      e.target.value = null;
      return;
    }
    setError("");
    setSelectedFile(file);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedType) {
      setError("Please select an administrative certificate track.");
      return;
    }
    if (!selectedFile) {
      setError("Please attach a valid supporting PDF file.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await API.post("/api/certificates/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await API.post("/api/certificates", {
        certificateType: selectedType,
        documentUrl: uploadRes.data.documentUrl,
      });

      setSuccess("Your digital application has been lodged successfully.");
      setSelectedType("");
      setSelectedFile(null);
      const input = document.getElementById("pdf-file-selector");
      if (input) input.value = "";
      loadMyCertificates();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to submit to server node. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (id, type) => {
    try {
      const response = await API.get(`/api/certificates/${id}/download`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${type.toLowerCase()}_certificate_${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download Error:", err);
      setError("An institutional network error prevented document fetch.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 py-4">
      {/* Page Header Introduction Frame */}
      <div className="space-y-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Certificate Desk
        </h2>
        <p className="text-gray-500 text-sm font-medium">
          File applications for official documentation directly to the Gram Panchayat registry system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form Framework */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-lg">Apply for Documentation</h3>
            <p className="text-xs text-gray-400 font-medium">
              Select a category and upload mandatory verification manifests.
            </p>
          </div>

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

          <form onSubmit={handleApply} className="space-y-5">
            {/* Category Grid Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                1. Select Certificate Category
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {certificateTypes.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedType === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedType(item.id)}
                      className={`p-3 rounded-xl border transition-all text-left flex items-start gap-3 w-full group relative ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 text-emerald-950 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                      }`}
                    >
                      <div className={`p-2 rounded-lg border shrink-0 ${
                        isSelected ? "bg-emerald-600 text-white border-emerald-700" : "bg-gray-50 group-hover:bg-gray-100 border-gray-200"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 pr-4">
                        <p className="font-bold text-sm tracking-tight">{item.name}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{item.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drag & Drop File Upload Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                2. Mandatory Support Attachments
              </label>
              <div className={`border-2 border-dashed rounded-xl p-5 bg-gray-50 text-center transition-all relative ${
                selectedFile
                  ? "border-emerald-500 bg-emerald-50/20"
                  : "border-gray-200 hover:border-emerald-500"
              }`}>
                <input
                  id="pdf-file-selector"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-2 pointer-events-none flex flex-col items-center">
                  {selectedFile ? (
                    <>
                      <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5 max-w-[220px]">
                        <p className="text-xs font-bold text-emerald-800 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] font-semibold text-gray-400">
                          {(selectedFile.size / 1024).toFixed(1)} KB · Ready
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2.5 bg-white border border-gray-200 text-gray-400 rounded-xl shadow-sm">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-600">
                          Upload file or drop item here
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          PDF configuration profiles only · Max 5MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedType || !selectedFile}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Application...</span>
                </>
              ) : (
                <span>Submit Form Application</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Applications History Log View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <FileText className="w-4 h-4 text-gray-400" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Filed Documentation Registers
            </h3>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-gray-400">Loading tracking indices...</p>
            </div>
          ) : certs.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center space-y-3">
              <div className="w-12 h-12 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center mx-auto text-gray-300">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                No active registry entries belong to this profile card.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
              {certs.map((c) => {
                const StatusIcon = statusIcons[c.status?.toUpperCase()] || Clock;
                const statusStyle = statusColors[c.status?.toUpperCase()] || "bg-gray-50 text-gray-600";

                return (
                  <div key={c.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 hover:bg-gray-50/40 transition-colors">
                    <div className="space-y-2 w-full sm:w-auto">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-gray-900 text-base tracking-tight">
                          {c.certificateType} Certificate
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          Application Context ID: #{c.id} · Applied:{" "}
                          <span className="text-gray-600 font-semibold">
                            {c.appliedDate ? new Date(c.appliedDate).toLocaleDateString("en-IN") : "—"}
                          </span>
                        </p>
                      </div>

                      {/* Explicit State Messaging Textblocks */}
                      <div className="space-y-1 pt-1">
                        {c.certificateNumber && (
                          <div className="text-xs text-emerald-800 font-mono font-bold bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5 inline-block">
                            Cert Record: {c.certificateNumber}
                          </div>
                        )}
                        {c.approvalRemarks && (
                          <p className="text-xs text-gray-500 font-medium bg-gray-50 px-2.5 py-1 rounded border border-gray-100">
                            <span className="font-bold text-gray-400 uppercase text-[10px] block tracking-wide">Registry Comments:</span>
                            {c.approvalRemarks}
                          </p>
                        )}
                        {c.rejectionRemarks && (
                          <p className="text-xs text-rose-600 font-medium bg-rose-50/50 px-2.5 py-1 rounded border border-rose-100">
                            <span className="font-bold text-rose-400 uppercase text-[10px] block tracking-wide">Rejection Reason:</span>
                            {c.rejectionRemarks}
                          </p>
                        )}
                      </div>

                      {c.documentUrl && (
                        <a
                          href={c.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold hover:text-emerald-700 hover:underline pt-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Submitted Attachment</span>
                        </a>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${statusStyle}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{c.status?.replace("_", " ")}</span>
                      </span>

                      {c.status === "GENERATED" && (
                        <button
                          onClick={() => handleDownload(c.id, c.certificateType)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Verification Stamp Footer */}
      <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium text-gray-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Central Document Management Pipeline</span>
        </div>
        <p className="text-[10px] tracking-wider uppercase font-bold text-gray-300">GramSetu DocNode v1.0</p>
      </div>
    </div>
  );
};

export default CertificatePage;

