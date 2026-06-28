import { useEffect, useState } from "react";
import API from "../../api/axios";

const WatermanDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("OFF");


  const loadSupplyStatus = () => {
    API.get("/api/waterman/status")
      .then(res => {
        setStatus(res.data.status)
        setLogs(res.data.history || []);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadSupplyStatus();
  }, []);

  const toggleWater = async () => {
    const nextState = status == "ON " ? "OFF" : "ON";
    try {
      await API.post("/api/waterman/toggle", { status: nextState });
      setStatus(nextState);
      loadSupplyStatus();
    } catch (err) {
      alert("Failed to communicate with the valve");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Water Utility Distribution Control</h1>
          <p className="text-sm text-gray-500">Toggle public village main water lines and review timestamp log tracking.</p>
        </div>
        <button
          onClick={toggleWater}
          className={`px-6 py-4 rounded-2xl text-lg font-black tracking-wider shadow-md transition transform active:scale-95 ${status === "ON" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          {status === "ON" ? "🛑 TURN OFF VALVE" : "🚰 TURN ON VALVE"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-lg">Valve Action Log History</h3>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-400">No shift events triggered during this tracking interval cycle.</p>
        ) : (
          <div className="divide-y text-sm">
            {logs.map((log, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <span className={`font-bold uppercase tracking-wider text-xs px-2.5 py-0.5 rounded-full ${log.action === "ON" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                  VALVE {log.action}
                </span>
                <span className="font-mono text-gray-500 text-xs">{log.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );


}
export default WatermanDashboard;