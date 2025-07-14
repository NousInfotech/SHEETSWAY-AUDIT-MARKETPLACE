import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BusinessProfileTab from '@/features/business-profiles/components/business-profile-tab';
import PlaidIntegrationTab from '@/features/business-profiles/components/plaid-integration-tab';

export const metadata = {
  title: 'Business Profiles & Integrations',
};

export default function BusinessProfilesPage() {
  return (
    <div className="container mx-auto py-8 px-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Business Profiles & Integrations</h1>
      <Tabs defaultValue="business-profile" className="w-full">
        <TabsList>
          <TabsTrigger value="business-profile">Business Profile</TabsTrigger>
          <TabsTrigger value="plaid">Plaid</TabsTrigger>
        </TabsList>
        <TabsContent value="business-profile" className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <BusinessProfileTab />
        </TabsContent>
        <TabsContent value="plaid" className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <PlaidIntegrationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}