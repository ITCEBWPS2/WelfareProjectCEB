import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:8070/api/v1/scholarships";

const ScholarshipList = ({ statusFilter }) => {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  // Fetch all scholarships
  useEffect(() => {
    fetchScholarships();
  }, [statusFilter]);

  const fetchScholarships = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/viewScholarships`);
      const filtered = statusFilter
        ? res.data.data.filter(
            (sch) => sch.status?.toLowerCase() === statusFilter.toLowerCase()
          )
        : res.data.data;
      setScholarships(filtered);
    } catch (err) {
      console.error("Error fetching scholarships:", err);
    }
  };

  const updateStatus = async (id, status) => {
    const result = await Swal.fire({
      title: `Confirm ${status}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${BASE_URL}/updateStatus/${id}`, { status });
        Swal.fire("Success", `Scholarship ${status} successfully`, "success");
        setSelectedScholarship(null);
        fetchScholarships();
      } catch (err) {
        Swal.fire("Error", "Failed to update scholarship status", "error");
      }
    }
  };

  const deleteScholarship = async (id) => {
    const result = await Swal.fire({
      title: "Delete Scholarship?",
      text: "This action is permanent!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/deleteScholarship/${id}`);
        Swal.fire("Deleted!", "Scholarship has been deleted.", "success");
        setSelectedScholarship(null);
        fetchScholarships();
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  return (
    <div className="p-6">
      {/* Scholarship Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white text-left">
              <th className="p-3">#</th>
              <th className="p-3">EPF Number</th>
              {/* <th className="p-3">Parent Name</th> */}
              <th className="p-3">Child Name</th>
              <th className="p-3">Grade</th>
              <th className="p-3">School</th>
              <th className="p-3">Scholarship Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((scholarship, index) => (
              <tr
                key={scholarship._id}
                className="border-b hover:bg-orange-50 transition"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{scholarship.epfNumber}</td>
                {/* <td className="p-3">{scholarship.name}</td> */}
                <td className="p-3">{scholarship.childName}</td>
                <td className="p-3">{scholarship.grade}</td>
                <td className="p-3">{scholarship.school}</td>
                <td className="p-3">{scholarship.scholarshipType}</td>
                <td className="p-3">
                  <span
                    className={`font-semibold ${
                      scholarship.status === "approved"
                        ? "text-green-600"
                        : scholarship.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {scholarship.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  {scholarship.status?.toLowerCase() === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(scholarship._id, "approved")
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(scholarship._id, "rejected")
                        }
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteScholarship(scholarship._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedScholarship(scholarship)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scholarship Details Modal */}
      {selectedScholarship && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedScholarship(null)}
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500 font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-orange-600 mb-4">
              Scholarship Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
              <p>
                <strong>EPF Number:</strong> {selectedScholarship.epfNumber}
              </p>
              <p>
                <strong>Parent Name:</strong> {selectedScholarship.name}
              </p>
              <p>
                <strong>Child Name:</strong> {selectedScholarship.childName}
              </p>
              <p>
                <strong>Grade:</strong> {selectedScholarship.grade}
              </p>
              <p>
                <strong>School:</strong> {selectedScholarship.school}
              </p>
              <p>
                <strong>Scholarship Type:</strong>{" "}
                {selectedScholarship.scholarshipType}
              </p>
              <p>
                <strong>Academic Performance:</strong>{" "}
                {selectedScholarship.academicPerformance || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {selectedScholarship.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipList;
