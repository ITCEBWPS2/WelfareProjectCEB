// src/components/BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; 

const BackButton = ({ to }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="text-white hover:text-gray-300 p-2 rounded-full transition-colors top-4 left-4"
      title="Go back"
    >
      <FaArrowLeft size={20} />
    </button>
  );
};

export default BackButton;
