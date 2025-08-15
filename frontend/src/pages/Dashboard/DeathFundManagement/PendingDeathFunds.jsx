import React from 'react';
import FilteredDeathFundList from '../DeathFundManagement/FilteredDeathFundList';

const ViewPendingDeathFunds = () => {
  return <FilteredDeathFundList statusFilter="pending" />;
};

export default ViewPendingDeathFunds;
