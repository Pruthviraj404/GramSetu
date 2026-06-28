import { useEffect,useState } from "react";
import API from "../../api/axios";

const NotificationsPage=()=>{
  const[notifications,setNotifications]= useState([]);

  useEffect(()=>{
    API.get("/api/notifications/my").then(res=>setNotifications(res.data)).catch(console.error);
  },[]);


  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gram Panchayat Public Board</h2>
        <p className="text-gray-500 text-sm">Critical village mandates, water timing alerts, and community notices.</p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center text-gray-400 shadow-sm">
          📭 No active updates or structural announcements recorded at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white border-l-4 border-emerald-600 rounded-r-2xl rounded-l p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-start gap-4">
                <h4 className="font-bold text-gray-900 text-lg">{n.title}</h4>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-mono font-medium">
                  {n.type || "GENERAL"}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;


