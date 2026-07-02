import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
    Bell,
    Send,
    MapPin,
    MessageSquare,
    Clock,
    User,
    Activity,
    AlertTriangle
} from "lucide-react";

const ManageWaterAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [areas, setAreas] = useState([]);

    const [formdata, setFormdata] = useState({
        area: "",
        message: ""
    });

    const [submitting, setSubmitting] = useState(false);


    const loadAreas = async () => {
        try {
            const res =  await API.get("/api/areas");
            setAreas(res.data);
        } catch (err) {
            console.error("Failed to load areas:", err);
        }
    };


    const loadAlerts = async () => {
        try {
            const res = await API.get("/api/water-alerts");
            setAlerts(res.data);
        } catch (err) {
            console.error("Failed to fetch notification timelines:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlerts();
        loadAreas();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormdata((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitAlert = async (e) => {
        e.preventDefault();
        if (!formdata.area.trim() || !formdata.message.trim()) return;
        setSubmitting(true);
        try {
            await API.post("/api/water-alerts", formdata);
            setFormdata({ area: "", message: "" });
            await loadAlerts();
        } catch (err) {
            console.error("Submission vector validation drop:", err);
            alert("Failed to broadcast water asset allocation notice.");


        } finally {
            setSubmitting(false);
        }
    };


    const formatDate = (dateString) => {
        if (!dateString) return "-";

        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6 p-1">
            {/* Structural Header Context Block */}
            <div className="border-b border-gray-100 pb-5">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
                    Water Distribution Broadcaster
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Issue critical timing parameters, pressure anomalies, or maintenance alerts directly mapped to localized residential sector grids.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column: Interactive Dispatch Panel */}
                <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm space-y-4 lg:col-span-1">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <h3 className="font-extrabold text-gray-900 text-sm tracking-tight uppercase">Compose Broadcast Notice</h3>
                    </div>

                    <form onSubmit={handleSubmitAlert} className="space-y-4">
                        {/* Target Area block */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                                Target Sector / Ward Block
                            </label>

                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />

                                <select
                                    name="area"
                                    value={formdata.area}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Area</option>

                                    {areas.length > 0 ? (
                                        areas.map((area) => (
                                            <option key={area.id} value={area.areaName}>
                                                {area.areaName}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Loading areas...</option>
                                    )}
                                </select>

                                {/* Dropdown Arrow */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Notification message input field */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                                Broadcast Dispatch Message
                            </label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                                <textarea
                                    name="message"
                                    value={formdata.message}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Water supply delayed by 2 hours due to valve maintenance."
                                    required
                                    rows="4"
                                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400 outline-none transition duration-150 resize-none leading-relaxed"
                                />
                            </div>
                        </div>

                        {/* Action Trigger Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition duration-150 shadow-sm shadow-blue-600/10"
                        >
                            <Send className="w-4 h-4 shrink-0" />
                            <span>{submitting ? "Broadcasting Notice..." : "Transmit Live Alert"}</span>
                        </button>
                    </form>
                </div>

                {/* Right Column: Historical Ledger History Block Mapping Response Output */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
                        <h3 className="font-extrabold text-gray-500 text-xs tracking-wider uppercase">Active Network Broadcast Logs</h3>
                        <span className="text-[10px] font-bold bg-gray-100 border text-gray-600 font-mono px-2 py-0.5 rounded-md">
                            Total Managed: {alerts.length}
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20 text-gray-400 text-sm font-medium animate-pulse">
                            <Activity className="animate-spin h-5 w-5 mr-3 text-gray-500" />
                            Syncing broad-spectrum network telemetry...
                        </div>
                    ) : alerts.length === 0 ? (
                        <div className="bg-white border border-gray-200/90 rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
                            <AlertTriangle className="w-10 h-10 text-gray-300 mb-3" />
                            <p className="font-bold text-gray-900 text-sm">No Active Outages</p>
                            <p className="text-gray-400 text-xs mt-0.5">The notification log buffer is currently unpopulated.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                            {alerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-sm hover:shadow-md transition duration-150 flex flex-col justify-between gap-3.5 group"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            {/* Dynamic Localized Target Badge */}
                                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                                                <MapPin className="w-3 h-3 stroke-[2.5]" />
                                                {alert.area}
                                            </span>

                                            {/* Technical Reference Code Index */}
                                            <span className="text-[10px] font-mono text-gray-400 font-bold group-hover:text-gray-500 transition-colors">
                                                ALERT_NODE #{alert.id}
                                            </span>
                                        </div>

                                        <p className="text-gray-700 text-sm font-medium leading-relaxed bg-gray-50/40 border border-gray-100 p-3 rounded-xl">
                                            {alert.message}
                                        </p>
                                    </div>

                                    {/* Micro Metadata Footer Layout Mapping WaterAlertResponse properties */}
                                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium border-t border-gray-50 pt-2.5">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-gray-400" />
                                            <span>Issued By: <span className="font-bold text-gray-600">{alert.createdByName || "System Dispatch"}</span></span>
                                        </div>

                                        <div className="flex items-center gap-1.5 font-mono">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span>{formatDate(alert.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageWaterAlerts;
