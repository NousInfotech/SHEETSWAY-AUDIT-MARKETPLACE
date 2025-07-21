import PageContainer from '@/components/layout/page-container';
import EngagementViewPage from '@/features/engagements/engagement-view-page';

export default function Page() {
  return (
    <PageContainer>
      <div className='container mx-auto'>
        <EngagementViewPage />
      </div>
    </PageContainer>
  );
}
