import { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  Droplets, 
  Megaphone, 
  User, 
  Calendar, 
  MapPin, 
  BellRing, 
  FileText,
  ShieldCheck,
  Clock,
  CornerDownRight
} from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [waterAlerts, setWaterAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Concurrently fetch both data streams to prevent multi-stage layout shifts
    Promise.all([
      API.get("/api/notifications/my").catch(err => ({ data: [], error: err })),
      API.get("/api/water-alerts/my").catch(err => ({ data: [], error: err }))
    ]).then(([notifRes, waterRes]) => {
      if (!notifRes.error) setNotifications(notifRes.data);
      if (!waterRes.error) setWaterAlerts(waterRes.data);
    }).catch(err => {
      console.error("Critical error syncing public notices:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 py-4">
      
      {/* 1. Page Header Frame */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Public Notice Board</h2>
          <p className="text-gray-500 text-sm font-medium">
            Monitor real-time infrastructure alerts, utility schedules, and official village assemblies.
          </p>
        </div>
        
        {/* Total Board Analytics Badge */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0">
          <BellRing className="w-5 h-5 text-emerald-600" />
          <div className="text-xs">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Bulletins</p>
            <p className="text-gray-800 font-extrabold">{notifications.length + waterAlerts.length} Feeds Online</p>
          </div>
        </div>
      </div>

      {/* 2. Primary Loading / Grid Pipe Splitter */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border rounded-2xl space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-400">Fetching community bulletin updates...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* SECTION A: WATER UTILITY ALERTS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Droplets className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Water Supply Dispatches ({waterAlerts.length})
              </h3>
            </div>

            {waterAlerts.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center text-gray-400 text-sm font-medium">
                No active water utility schedules listed.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {waterAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-gray-900 text-lg tracking-tight flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>{alert.area || "All Wards"}</span>
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400">
                          <CornerDownRight className="w-3 h-3 text-gray-300" />
                          <span>Dispatch ID: #{alert.id}</span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase bg-blue-50 border-blue-100 text-blue-700">
                        <Droplets className="w-3 h-3" />
                        <span>Utility Alert</span>
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm font-medium leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                      {alert.message}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-gray-400 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-300" />
                        Issued By: <b className="text-gray-600">{alert.createdByName || "Panchayat Admin"}</b>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono">
                        <Clock className="w-3.5 h-3.5 text-gray-300" />
                        {new Date(alert.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION B: GENERAL CIVIC NOTICES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Megaphone className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Administrative Bulletins ({notifications.length})
              </h3>
            </div>

            {notifications.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center text-gray-400 text-sm font-medium">
                No active public announcements or decrees found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {notifications.map((n) => (
                  <div 
                    key={n.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h4 className="font-black text-gray-900 text-lg tracking-tight hover:text-emerald-700 transition-colors">
                          {n.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400">
                          <CornerDownRight className="w-3 h-3 text-gray-300" />
                          <span>Notice Bulletin: #{n.id}</span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase bg-emerald-50 border-emerald-100 text-emerald-700">
                        <FileText className="w-3 h-3" />
                        <span>{n.type || "GENERAL"}</span>
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm font-medium leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                      {n.message}
                    </p>

                    {n.createdAt && (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400 pt-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-300" />
                        <span>Published: {new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. Transaction Guarantee Note Footer */}
      <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium text-gray-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Local Governance Administration Feed</span>
        </div>
        <p className="text-[10px] tracking-wider uppercase font-bold text-gray-300">GramSetu Broadcast Node v1.0</p>
      </div>

    </div>
  );
};

export default NotificationsPage;