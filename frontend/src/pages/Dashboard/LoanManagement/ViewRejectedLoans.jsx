import React from 'react';
import FilteredLoanList from '../LoanManagement/FilteredLoanList';

const ViewRejectedLoans = () => {
  return <FilteredLoanList title="Rejected Loans" statusFilter="rejected" />;
};

export default ViewRejectedLoans;
