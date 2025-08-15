import React from 'react';
import FilteredDeathFundList from '../DeathFundManagement/FilteredDeathFundList';

const ViewRejectedDeathFunds = () => {
  return <FilteredDeathFundList statusFilter="rejected" />;
};

export default ViewRejectedDeathFunds;
