// PendingScholarships.jsx
import React from "react";
import FilteredScholarshipList from "./FilteredScholarships";

const PendingScholarships = () => {
  return <FilteredScholarshipList statusFilter="pending" />;
};

export default PendingScholarships;
