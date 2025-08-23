import React from 'react'; // Removed useEffect

import BankingDashboardPage from '@/app/dashboard/banking&accounts/page';

function BankingDataView() {
  return (
    <>
      <div className='mt-4 border-t p-4'>
        <BankingDashboardPage />
      </div>
    </>
  );
}

export default BankingDataView;
