
import React from 'react';

// --- ICONS (Can be replaced with a library like 'react-icons') ---
const CheckCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> );
const ClockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" /></svg> );
const ShieldExclamationIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.002L2 15.02a1 1 0 001 1h14a1 1 0 001-1V5.002A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" /></svg> );

// --- TYPESCRIPT INTERFACE ---
// Defines the shape of the data the card expects
interface EscrowCardProps {
  escrow: {
    id: string;
    paymentId: string;
    isReleased: boolean;
    releaseDate: string | null;
    underDispute: boolean;
    createdAt: string;
    payment: {
      stripePaymentId: string;
      amount: number;
      currency?: string;
      status: string;
    } | null; // Allow payment to be null for safety
  };
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({ label, value, mono = false }) => (
  <div className="flex flex-col">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className={`mt-1 text-sm text-gray-900 ${mono ? 'font-mono' : ''}`}>{value}</dd>
  </div>
);


export const EscrowCard: React.FC<EscrowCardProps> = ({ escrow }) => {
  const { isReleased, releaseDate, underDispute, createdAt, payment } = escrow;

  // --- FORMATTING & LOGIC ---
  const formattedAmount = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: (payment?.currency || 'usd').toUpperCase(),
  }).format((payment?.amount || 0) / 100);

  const getEscrowStatus = () => {
    if (underDispute) {
      return { text: 'Disputed', color: 'bg-red-100 text-red-700', icon: <ShieldExclamationIcon /> };
    }
    if (isReleased) {
      return { text: 'Released', color: 'bg-green-100 text-green-700', icon: <CheckCircleIcon /> };
    }
    return { text: 'In Escrow', color: 'bg-yellow-100 text-yellow-700', icon: <ClockIcon /> };
  };

  const escrowStatus = getEscrowStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6 transition-all hover:shadow-lg hover:border-blue-300">
      {/* --- CARD HEADER --- */}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-3xl font-bold text-gray-800">{formattedAmount}</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${escrowStatus.color}`}>
            {escrowStatus.icon}
            <span>{escrowStatus.text}</span>
          </div>
        </div>
      </div>

      {/* --- CARD DETAILS --- */}
      <div className="bg-gray-50 px-6 py-4 border-t border-b border-gray-200">
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
           <DetailItem label="Created On" value={new Date(createdAt).toLocaleDateString()} />
           <DetailItem label="Release Date" value={releaseDate ? new Date(releaseDate).toLocaleDateString() : 'Pending'} />
           <DetailItem label="Payment Status" value={<span className="capitalize">{payment?.status || 'N/A'}</span>} />
           <DetailItem label="Payment Method" value={ "Stripe"} />
        </dl>
      </div>

      {/* --- CARD FOOTER (IDs) --- */}
      <div className="px-6 py-4">
          <div className="space-y-2">
            <DetailItem label="Payment ID" value={escrow.paymentId} mono />
            <DetailItem label="Stripe ID" value={<span className="truncate">{payment?.stripePaymentId || 'N/A'}</span>} mono />
          </div>
      </div>
    </div>
  );
};

export default EscrowCard;