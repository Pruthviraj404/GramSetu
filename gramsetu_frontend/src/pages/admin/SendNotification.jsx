import { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-hot-toast";
import { Megaphone, MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const SendNotification = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "ANNOUNCEMENT",
    targetArea: "ALL"
  });

  const [areas, setAreas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);

  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    let isMounted = true;
    const loadAreas = async () => {
      try {


        const res = await API.get("/api/areas");
        if (isMounted) {
          const filtered = res.data.filter((a) => a.areaName && a.areaName.toUpperCase() !== "ALL");
          setAreas(filtered);
        }

      } catch (err) {
        console.error("Sentry Log - Areas Fetch Failed: ", err);
        toast.error("Failed to load village administration layout.");

      } finally {
        if (isMounted) setIsLoadingAreas(false);
      }
    };
    loadAreas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBroadcastDeploy = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      setStatusMessage({ text: "Please fill in all the fields before sending.", type: "error" });
      toast.error("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);

    setStatusMessage({ text: "", type: "" });

    try {
      await API.post("/api/notifications", formData);

      const targetText = formData.targetArea === "ALL" ? "Entire Village" : formData.targetArea;

      setStatusMessage({
        text: `Success! Your notice has been sent to the ${targetText}.`,
        type: "success"
      });
      toast.success("Notice Sent!");


      setFormData({
        title: "",
        message: "",
        type: "ANNOUNCEMENT",
        targetArea: "ALL"

      });


    } catch (err) {
      console.error("entry Production Broadcast Trace: ", err);
      setStatusMessage({
        text: err.response?.data?.message || "Failed to send notice. Connection lost.",
        type: "error"
      });
      toast.error("Failed to send.");

    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-xl p-6 sm:p-8 mt-6">
      
      {/* Header Frame */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5 mb-6">
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
          <Megaphone className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Send New Notice</h2>
          <p className="text-xs text-gray-400 mt-0.5">Publish announcements or emergency alerts to citizen dashboards.</p>
        </div>
      </div>

      {/* --- SUCCESS / ERROR MESSAGE BANNER --- */}
      {statusMessage.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border text-sm font-medium transition-all ${
          statusMessage.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleBroadcastDeploy} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Simple Dropdown 1: Notice Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notice Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:border-emerald-500 transition outline-none disabled:bg-gray-50 cursor-pointer"
            >
              <option value="ANNOUNCEMENT">📢 General Announcement</option>
              <option value="WATER_SUPPLY">💧 Water Alert</option>
              <option value="EMERGENCY">🚨 Emergency / Hazard</option>
              <option value="TAX_REMINDER">💼 Tax Reminder</option>
              <option value="GRAM_SABHA_MEETING">🏛️ Gram Sabha Meeting</option>
            </select>
          </div>

          {/* Simple Dropdown 2: Target Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Who will see this?
            </label>
            <select
              name="targetArea"
              value={formData.targetArea}
              onChange={handleInputChange}
              disabled={isSubmitting || isLoadingAreas}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:border-emerald-500 transition outline-none disabled:bg-gray-50 cursor-pointer"
            >
              <option value="ALL">Everyone (All Wards & Colonies)</option>
              {areas.map((area) => (
                <option key={area.id} value={area.areaName}>
                  Only: {area.areaName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Notice Heading / Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="e.g., Water Cut Tomorrow Morning"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 transition outline-none shadow-sm disabled:bg-gray-50 placeholder:text-gray-300"
          />
        </div>

        {/* Message Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Notice Description / Message</label>
          <textarea
            rows={4}
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="Write details or instructions here for the citizens..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 transition outline-none shadow-sm disabled:bg-gray-50 placeholder:text-gray-300 resize-none"
          />
        </div>

        {/* Simple Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoadingAreas}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending Notice...</span>
            </>
          ) : (
            <span>Publish Notice</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default SendNotification;