import { useEffect, useState } from "react";
import API from "../../api/axios";

const statusColors = {
  PENDING: "bg-amber-100 text-amber-800",
  UNDER_VERIFICATION: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  GENERATED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const certificateTypes = ["RESIDENCE", "INCOME", "BIRTH", "DEATH"];

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
      setError("Only PDF files are accepted.");
      setSelectedFile(null);
      e.target.value = null;
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
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
      setError("Please select a certificate type.");
      return;
    }
    if (!selectedFile) {
      setError("Please upload a PDF document.");
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

      setSuccess("Application submitted successfully!");
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
        "Something went wrong. Try again."
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
      setError("Failed to download certificate.");
    }
  };

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Certificates</h2>
        <p className="text-gray-500 text-sm mt-1">
          Apply for official Gram Panchayat certificates
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 text-lg">
          Apply for New Certificate
        </h3>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleApply} className="space-y-5 max-w-xl">

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
              Select Certificate Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {certificateTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`p-3 rounded-xl border font-semibold text-sm transition text-left flex items-center justify-between ${
                    selectedType === type
                      ? "border-green-600 bg-green-50 text-green-900 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                  }`}
                >
                  <span>
                    {type === "RESIDENCE" && "🏠 "}
                    {type === "INCOME" && "💰 "}
                    {type === "BIRTH" && "👶 "}
                    {type === "DEATH" && "📋 "}
                    {type}
                  </span>
                  {selectedType === type && (
                    <span className="text-green-600 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
              Upload Supporting Document (PDF only, max 5MB)
            </label>
            <div className={`border-2 border-dashed rounded-xl p-6 bg-gray-50 text-center transition relative ${
              selectedFile
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-400"
            }`}>
              <input
                id="pdf-file-selector"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="space-y-1 pointer-events-none">
                {selectedFile ? (
                  <>
                    <p className="text-2xl">📎</p>
                    <p className="text-sm font-semibold text-green-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl">📄</p>
                    <p className="text-sm font-semibold text-gray-600">
                      Click to upload or drag PDF here
                    </p>
                    <p className="text-xs text-gray-400">PDF only · Max 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedType || !selectedFile}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm transition disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-lg">My Applications</h3>

        {loading ? (
          <div className="text-gray-400 text-sm py-4">Loading...</div>
        ) : certs.length === 0 ? (
          <div className="bg-white rounded-2xl border p-8 text-center text-gray-400 text-sm">
            No applications found. Apply above to get started.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border divide-y overflow-hidden shadow-sm">
            {certs.map((c) => (
              <div key={c.id} className="p-4 flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 text-sm">
                    {c.certificateType === "RESIDENCE" && "🏠 "}
                    {c.certificateType === "INCOME" && "💰 "}
                    {c.certificateType === "BIRTH" && "👶 "}
                    {c.certificateType === "DEATH" && "📋 "}
                    {c.certificateType} Certificate
                  </p>
                  <p className="text-xs text-gray-400">
                    Application #{c.id} · Applied:{" "}
                    {c.appliedDate
                      ? new Date(c.appliedDate).toLocaleDateString("en-IN")
                      : "—"}
                  </p>
                  {c.certificateNumber && (
                    <p className="text-xs text-green-700 font-mono font-bold">
                      Cert No: {c.certificateNumber}
                    </p>
                  )}
                  {c.approvalRemarks && (
                    <p className="text-xs text-gray-500">
                      Remarks: {c.approvalRemarks}
                    </p>
                  )}
                  {c.rejectionRemarks && (
                    <p className="text-xs text-red-500">
                      Reason: {c.rejectionRemarks}
                    </p>
                  )}
                  {c.documentUrl && (
                    <a
                      href={c.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 font-medium hover:underline inline-block"
                    >
                      🔗 View Uploaded Document
                    </a>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    statusColors[c.status] || "bg-gray-100 text-gray-600"
                  }`}>
                    {c.status?.replace("_", " ")}
                  </span>

                  {c.status === "GENERATED" && (
                    <button
                      onClick={() => handleDownload(c.id, c.certificateType)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      ⬇ Download
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CertificatePage;