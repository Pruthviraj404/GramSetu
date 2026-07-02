import { useEffect, useState } from "react";
import API from "../../api/axios";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [waterAlerts, setWaterAlerts] = useState([]);


  useEffect(() => {

    loadNotifications();
    loadWaterAlerts();
  }, []);


  const loadNotifications = async () => {
    try {
      const res = await API.get("/api/notifications/my");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);

    }
  };

  const loadWaterAlerts = async () => {
    try {
      const res = await API.get("/api/water-alerts/my");
      setWaterAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold">
          Gram Panchayat Public Board
        </h2>
        <p className="mt-2 text-emerald-100">
          Stay updated with important village announcements and water supply alerts.
        </p>
      </div>

      {/* Water Alerts */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            🚰 Water Supply Alerts
          </h3>

          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            {waterAlerts.length} Alerts
          </span>
        </div>

        {waterAlerts.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No active water alerts.
          </div>
        ) : (
          <div className="space-y-4">
            {waterAlerts.map((alert) => (
              <div
                key={alert.id}
                className="border-l-4 border-blue-600 bg-blue-50 rounded-xl p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-blue-800 text-lg">
                    📍 {alert.area}
                  </h4>

                  <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                    Water Alert
                  </span>
                </div>

                <p className="text-gray-700 mt-3 leading-relaxed">
                  {alert.message}
                </p>

                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>
                    👤 {alert.createdByName}
                  </span>

                  <span>
                    🕒 {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
            📢 Public Notifications
          </h3>

          <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
            {notifications.length} Notices
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No public notifications available.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="border-l-4 border-emerald-600 bg-emerald-50 rounded-xl p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-emerald-800 text-lg">
                    {n.title}
                  </h4>

                  <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full">
                    {n.type || "GENERAL"}
                  </span>
                </div>

                <p className="text-gray-700 mt-3 leading-relaxed">
                  {n.message}
                </p>

                {n.createdAt && (
                  <div className="mt-4 text-xs text-gray-500">
                    🕒 {new Date(n.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
export default NotificationsPage;