import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:8070/api/v1/retirementGifts";

const FilteredRetirementGiftList = ({ statusFilter }) => {
  const [gifts, setGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);

  useEffect(() => {
    fetchGifts();
  }, [statusFilter]);

  const fetchGifts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/viewRetirementGifts`);
      const filtered = statusFilter
        ? res.data.filter((gift) => gift.status === statusFilter)
        : res.data;
      setGifts(filtered);
    } catch (err) {
      console.error("Error fetching retirement gifts:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${newStatus} this gift.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus}`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${BASE_URL}/updateRetirementGift/${id}`, { status: newStatus });
        Swal.fire("Success", `Gift ${newStatus} successfully`, "success");
        fetchGifts();
      } catch (err) {
        Swal.fire("Error", "Status update failed", "error");
      }
    }
  };

  const deleteGift = async (id) => {
    const result = await Swal.fire({
      title: "Delete Record?",
      text: "This action is permanent!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/deleteRetirementGift/${id}`);
        Swal.fire("Deleted!", "Record has been deleted.", "success");
        setSelectedGift(null);
        fetchGifts();
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl max-h-[450px] overflow-y-auto">
        <table className="min-w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-orange-500 text-white text-left">
              <th className="p-3 w-12">#</th>
              <th className="p-3 w-32">EPF Number</th>
              <th className="p-3 w-48">Employee Name</th>
              <th className="p-3 w-48">Gift Item</th>
              <th className="p-3 w-32">Gift Value</th>
              <th className="p-3 w-28">Status</th>
              <th className="p-3 w-52">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {gifts.slice(0, 9).map((gift, index) => (
              <tr key={gift._id} className="hover:bg-orange-50 transition">
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3">{gift.epfNumber}</td>
                <td className="p-3 truncate" title={gift.name}>{gift.name}</td>
                <td className="p-3 truncate" title={gift.giftDetails.giftDescription || gift.giftDetails.giftType}>
                  {gift.giftDetails.giftDescription || gift.giftDetails.giftType}
                </td>
                <td className="p-3">Rs. {gift.giftDetails.giftValue}</td>
                <td className="p-3">
                  <span
                    className={`font-semibold ${
                      gift.status === "approved"
                        ? "text-green-600"
                        : gift.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {gift.status || "pending"}
                  </span>
                </td>
                <td className="p-3 w-64">
                  <div className="flex gap-2 whitespace-nowrap overflow-x-auto">
                    {gift.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(gift._id, "approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(gift._id, "rejected")}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteGift(gift._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedGift(gift)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedGift && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedGift(null)}
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500 font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-orange-600 mb-4">
              Retirement Gift Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
              <p><strong>EPF Number:</strong> {selectedGift.epfNumber}</p>
              <p><strong>Employee Name:</strong> {selectedGift.name}</p>
              <p><strong>Date Joined:</strong> {new Date(selectedGift.dateJoined).toLocaleDateString()}</p>
              <p><strong>Date of Retirement:</strong> {new Date(selectedGift.dateOfRetire).toLocaleDateString()}</p>
              <p><strong>Gift Type:</strong> {selectedGift.giftDetails.giftType}</p>
              <p><strong>Gift Description:</strong> {selectedGift.giftDetails.giftDescription}</p>
              <p><strong>Gift Value:</strong> Rs. {selectedGift.giftDetails.giftValue}</p>
              <p><strong>Disbursement Method:</strong> {selectedGift.giftDetails.disbursementMethod}</p>
              <p><strong>Disbursement Date:</strong> {new Date(selectedGift.giftDetails.disbursementDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedGift.status || "pending"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilteredRetirementGiftList;
