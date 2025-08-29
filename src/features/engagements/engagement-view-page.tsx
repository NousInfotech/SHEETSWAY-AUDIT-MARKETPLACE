'use client';
import React, { useState, useEffect } from 'react';
import {
  Engagement,
  AccountingData,
  
  Payment,
  Contract,
  Review,
  BankingData
} from './types/engagement-types';
import {
  generateMockEngagements,
  generateMockAccountingData,
  generateMockBankingData,
  generateMockPayments,
  generateMockContracts,
  generateMockReviews
} from './data/mock-data';
import ActiveEngagements from './components/ActiveEngagements';
import EngagementWorkspace from './components/EngagementWorkspace';
import AccountingDataTab from './components/AccountingDataTab';
import BankingDataTab from './components/BankingDataTab';


import EngagementSettingsTab from './components/EngagementSettingsTab';
import DocumentsTab from './components/DocumentsTab';
import { Spinner } from '@/components/ui/spinner';
import { getEngagementById, listEngagements } from '@/api/engagement';
import { useClientEngagementStore } from './store';
import ClientDocument from './components/ClientDocumentTab';
import { FileUploadZone } from './components/file-manager/FileUploadZone';
import EngagementChatPage from '@/app/dashboard/engagements/[id]/chat/page';
import PaymentEscrowTab from './components/PaymentEscrowTab';
import MilestoneTab from './components/MilestoneTab';
import BankingDataView from './components/BankingDataView';


const EngagementViewPage = () => {
  // Remove local isDark and theme logic
  const [currentPage, setCurrentPage] = useState('engagements');
  const [selectedEngagement, setSelectedEngagement] = useState<any | null>(
    null
  );
  const [currentWorkspaceTab, setCurrentWorkspaceTab] = useState('accounting');
  // const [engagements, setEngagements] = useState<Engagement[]>([]);

  const [engagements, setEngagements] = useState<any[]>([]);

  const [accountingData, setAccountingData] = useState<AccountingData[]>([]);
  const [bankingData, setBankingData] = useState<BankingData[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const { clientEngagements } = useClientEngagementStore();

  useEffect(() => {
    const savedEngagements = localStorage.getItem('engagements');
    const savedAccountingData = localStorage.getItem('accountingData');
    const savedBankingData = localStorage.getItem('bankingData');
    const savedPayments = localStorage.getItem('payments');
    const savedContracts = localStorage.getItem('contracts');
    const savedReviews = localStorage.getItem('reviews');
    // setEngagements(
    //   savedEngagements && JSON.parse(savedEngagements).length > 0
    //     ? JSON.parse(savedEngagements)
    //     : generateMockEngagements()
    // );

    console.log(clientEngagements);
    setEngagements(clientEngagements);



    setAccountingData(
      savedAccountingData
        ? JSON.parse(savedAccountingData)
        : generateMockAccountingData()
    );
    setBankingData(
      savedBankingData
        ? JSON.parse(savedBankingData)
        : generateMockBankingData()
    );
    setPayments(
      savedPayments ? JSON.parse(savedPayments) : generateMockPayments()
    );
    setContracts(
      savedContracts ? JSON.parse(savedContracts) : generateMockContracts()
    );
    setReviews(savedReviews ? JSON.parse(savedReviews) : generateMockReviews());
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('engagements', JSON.stringify(engagements));
  }, [engagements]);
  useEffect(() => {
    localStorage.setItem('accountingData', JSON.stringify(accountingData));
  }, [accountingData]);
  useEffect(() => {
    localStorage.setItem('bankingData', JSON.stringify(bankingData));
  }, [bankingData]);
  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);
  useEffect(() => {
    localStorage.setItem('contracts', JSON.stringify(contracts));
  }, [contracts]);
  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);
  // Remove all isDark, setIsDark, and theme-related useEffects and logic

  // Restore mock data if all arrays are empty
  useEffect(() => {
    if (
      engagements.length === 0 &&
      accountingData.length === 0 &&
      bankingData.length === 0 &&
      payments.length === 0 &&
      contracts.length === 0 &&
      reviews.length === 0
    ) {
      // setEngagements(generateMockEngagements());
      setAccountingData(generateMockAccountingData());
      setBankingData(generateMockBankingData());
      setPayments(generateMockPayments());
      setContracts(generateMockContracts());
      setReviews(generateMockReviews());
    }
  }, [engagements, accountingData, bankingData, payments, contracts, reviews]);

  const handleToggleTheme = () => {
    // This function is no longer needed as theme is managed globally
  };
  const handleEnterWorkspace = (engagement: Engagement) => {
    setSelectedEngagement(engagement);
    setCurrentPage('workspace');
    setCurrentWorkspaceTab('accounting');
  };
  const handleBackToEngagements = () => {
    setCurrentPage('engagements');
    setSelectedEngagement(null);
  };
  const updateEngagement = (updatedEngagement: Engagement) => {
    setEngagements((prev) =>
      prev.map((eng) =>
        eng.id === updatedEngagement.id ? updatedEngagement : eng
      )
    );
    setSelectedEngagement(updatedEngagement);
  };

  const handleRefresh = () => {
    // Clear all relevant localStorage keys
    localStorage.removeItem('engagements');
    localStorage.removeItem('accountingData');
    localStorage.removeItem('bankingData');
    localStorage.removeItem('payments');
    localStorage.removeItem('contracts');
    localStorage.removeItem('reviews');
    // Set all state to empty arrays
    setEngagements([]);
    setAccountingData([]);
    setBankingData([]);
    setPayments([]);
    setContracts([]);
    setReviews([]);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'engagements':
        return (
          <ActiveEngagements
            engagements={engagements}
            selectedEngagement={selectedEngagement}
            setSelectedEngagement={setSelectedEngagement}
            onEnterWorkspace={handleEnterWorkspace}
            onRefresh={handleRefresh}
          />
        );
      case 'workspace':
        return selectedEngagement ? (
          <EngagementWorkspace
            engagement={selectedEngagement}
            currentTab={currentWorkspaceTab}
            onTabChange={setCurrentWorkspaceTab}
            onBack={handleBackToEngagements}
          >
            {currentWorkspaceTab === 'accounting' && (
              <></>
              // <AccountingDataTab data={accountingData} />
            )}
            {currentWorkspaceTab === 'banking' && (
              <BankingDataView />
            )}
            {currentWorkspaceTab === 'payments' && (
              <PaymentEscrowTab engagement={selectedEngagement} />
            )}
            {currentWorkspaceTab === 'reviews' && (
              <MilestoneTab engagement={selectedEngagement} />
            )}
            {currentWorkspaceTab === 'documents' && (
              <DocumentsTab engagement={selectedEngagement} />
            )}
            {currentWorkspaceTab === 'client documents' && <FileUploadZone />}
            {currentWorkspaceTab === 'settings' && (
              <EngagementSettingsTab
                engagement={selectedEngagement}
                onUpdate={updateEngagement}
              />
            )}
            {currentWorkspaceTab === 'chat' && (
              <EngagementChatPage engagement={selectedEngagement} />
            )}
          </EngagementWorkspace>
        ) : null;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <Spinner size={48} className='text-primary' />
      </div>
    );
  }

  return (
    <div className='bg-background text-foreground min-h-screen w-full transition-colors'>
      {renderCurrentPage()}
    </div>
  );
};

export default EngagementViewPage;
