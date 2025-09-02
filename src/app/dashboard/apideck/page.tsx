import PageContainer from '@/components/layout/page-container';
import ApideckHomePage from '@/features/engagements/components/ApideckHomePage';
import React from 'react';

function ApideckMainPage() {
  return (
    <PageContainer>
      <div className='w-full'>
        <ApideckHomePage />
      </div>
    </PageContainer>
  );
}

export default ApideckMainPage;
