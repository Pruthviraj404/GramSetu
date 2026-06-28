import { useState } from "react";
import API from "../../api/axios";

const SendNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("GENERAL");
  const [loading, setLoading] = useState(false);


  const sendNotification = async (e) => {
    e.preventDefault();
    if (!title || !message) return;
    setLoading(true);

    try {
      await API.post("/api/notifications", {
        title, message, targetArea: "ALL", type
      });
      alert("Broadcast alert pushed out to all  devices!");
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Broadcast connect drop");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border shadow-sm p-6 sm:p-8 mt-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Emergency & General Broadcasting</h2>
        <p className="text-sm text-gray-500">Pushes a notice banner directly out onto all resident portal dashboards immediately.</p>
      </div>

      <form onSubmit={sendNotification} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Notice Heading Title</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600 transition shadow-inner"
            placeholder="e.g., Scheduled Maintenance: Public Water Cut"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Broadcast Severity Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white focus:border-emerald-600 transition"
          >
            <option value="GENERAL">Standard Update Notice</option>
            <option value="WATER_ALERT">Water Service Notice</option>
            <option value="EMERGENCY">Emergency Critical Hazard</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Detailed Message Context</label>
          <textarea
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600 transition shadow-inner"
            placeholder="Write clear public guidelines or instructions here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-md disabled:opacity-60"
        >
          {loading ? "Transmitting..." : "Authorize & Deploy Public Broadcast"}
        </button>
      </form>
    </div>
  );
}

export default SendNotification;