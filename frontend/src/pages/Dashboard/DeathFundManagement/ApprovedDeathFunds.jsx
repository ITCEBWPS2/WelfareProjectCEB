import React from 'react';
import FilteredDeathFundList from '../DeathFundManagement/FilteredDeathFundList';

const ViewApprovedDeathFunds = () => {
  return <FilteredDeathFundList statusFilter="approved" />;
};

export default ViewApprovedDeathFunds;
