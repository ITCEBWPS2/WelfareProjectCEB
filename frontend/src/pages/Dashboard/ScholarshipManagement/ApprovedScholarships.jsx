// ApprovedScholarships.jsx
import React from "react";
import FilteredScholarshipList from "./FilteredScholarships";

const ApprovedScholarships = () => {
  return <FilteredScholarshipList statusFilter="approved" />;
};

export default ApprovedScholarships;
