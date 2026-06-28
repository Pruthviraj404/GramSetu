import { useState, useEffect } from "react";
import API from "../../api/axios";

const ComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComplaints = () => {
    API.get("/api/complaints/my").then(res => setComplaints(res.data)).catch(console.error);

  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;
    setLoading(true);
    try {
      await API.post("/api/complaints", { title, description });
      setTitle("");
      setDescription("");
      fetchComplaints();
    } catch (err) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl p-6 border shadow-sm sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-1">File a Grievance</h2>
          <p className="text-xs text-gray-500 mb-4">Submit requests regarding sanitation, lighting, water infrastructure disruptions.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Subject Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Streetlight broken near temple"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600 transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Detailed Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide accurate landmarks or specifics to assist field inspectors..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition shadow"
            >
              {loading ? "Lodging Complaint..." : "Submit Grievance Record"}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Your Submitted Complaints</h3>
        {complaints.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed p-12 text-center text-gray-400">
            No logged entries discovered under this personal registry file.
          </div>
        ) : (
          complaints.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-start gap-4">
                <h4 className="font-bold text-gray-900 text-lg">{c.title}</h4>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${c.status === "RESOLVED" ? "bg-green-100 text-green-800" : c.status === "PENDING" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
                  {c.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{c.description}</p>
              <div className="text-[11px] font-mono text-gray-400 pt-2 border-t mt-2">Log ID: #{c.id}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintPage;


