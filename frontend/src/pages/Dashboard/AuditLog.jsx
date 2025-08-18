import React, { useEffect, useState } from "react";
import { API } from "../../api/axiosInstance";
import SideBar from "../../pages/Dashboard/SideBar";
import bgImage from "../../images/background.png";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(response.data.data);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <SideBar />
      <main
        className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* <div className="absolute inset-0 bg-black/30 z-0" /> */}
        <div className="relative z-10 p-6">
          <h1 className="text-3xl font-bold text-white drop-shadow mb-6">Audit Logs</h1>

          <div className="overflow-x-auto bg-white/90 backdrop-blur-md rounded-xl shadow-md p-4">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-orange-600 text-white text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  {/* <th className="px-4 py-2 text-left">Event</th> */}
                  <th className="px-4 py-2 text-left">Description</th>
                  {/* <th className="px-4 py-2 text-left">Target</th> */}
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      {loading ? "Loading logs..." : "No logs available"}
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="border-b hover:bg-orange-50">
                      <td className="px-4 py-2">{log.user}</td>
                      <td className="px-4 py-2">{log.type}</td>
                      {/* <td className="px-4 py-2">{log.event}</td> */}
                      <td className="px-4 py-2">{log.message}</td>
                      {/* <td className="px-4 py-2">{log.target}</td> */}
                      <td className="px-4 py-2">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {log.data?.ip || "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuditLogs;
