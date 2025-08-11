import React from 'react';
import FilteredLoanList from '../LoanManagement/FilteredLoanList';

const ViewPendingLoans = () => {
  return <FilteredLoanList title="Pending Loans" statusFilter="pending" />;
};

export default ViewPendingLoans;
