// RejectedScholarships.jsx
import React from "react";
import FilteredScholarshipList from "./FilteredScholarships";

const RejectedScholarships = () => {
  return <FilteredScholarshipList statusFilter="rejected" />;
};

export default RejectedScholarships;
