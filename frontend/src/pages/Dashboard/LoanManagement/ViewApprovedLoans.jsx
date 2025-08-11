import React from 'react';
import FilteredLoanList from '../LoanManagement/FilteredLoanList';

const ViewApprovedLoans = () => {
  return <FilteredLoanList title="Approved Loans" statusFilter="approved" />;
};

export default ViewApprovedLoans;
