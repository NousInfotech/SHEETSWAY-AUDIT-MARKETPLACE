// import React, { useState, useEffect } from 'react';
// import { Payment, Contract } from '../types/engagement-types';
// import { Download } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

// // Mock deliverables data
// const mockDeliverables = [
//   { name: 'Final_Audit_Report.pdf', url: '/mock/Final_Audit_Report.pdf' },
//   { name: 'Audit_Working_Papers.zip', url: '/mock/Audit_Working_Papers.zip' },
// ];

// interface PaymentsContractsTabProps {
//   payments: Payment[];
//   contracts: Contract[];
// }

// const PaymentsContractsTab: React.FC<PaymentsContractsTabProps> = ({ payments, contracts }) => {
//   const [signatureStatus, setSignatureStatus] = useState<Record<string, string>>({});
//   const [deliverables, setDeliverables] = useState(mockDeliverables);
//   const [showAmendmentModal, setShowAmendmentModal] = useState(false);
//   const [amendmentText, setAmendmentText] = useState('');
//   const [amendmentContractId, setAmendmentContractId] = useState<string | null>(null);

//   useEffect(() => {
//     const stored = localStorage.getItem('signatureStatus');
//     if (stored) setSignatureStatus(JSON.parse(stored));
//   }, []);

//   const handleToggleSignature = (id: string) => {
//     setSignatureStatus(prev => {
//       const current = prev[id] || 'Pending Signature';
//       const next = current === 'Pending Signature' ? 'Signed' : current === 'Signed' ? 'Declined' : 'Pending Signature';
//       const updated = { ...prev, [id]: next };
//       localStorage.setItem('signatureStatus', JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const handleRequestFundRelease = (paymentId: string) => {
//     // TODO: Integrate with backend
//     toast.success('Fund release requested.');
//   };
//   const handleDispute = (paymentId: string) => {
//     // TODO: Integrate with backend
//     toast('Dispute requested. Our team will review your request.');
//   };
//   const handleRequestAmendment = (contractId: string) => {
//     setAmendmentContractId(contractId);
//     setShowAmendmentModal(true);
//   };
//   const handleSubmitAmendment = () => {
//     setShowAmendmentModal(false);
//     setAmendmentText('');
//     toast.success('Amendment request submitted.');
//     // TODO: Integrate with backend
//   };

//   return (
//     <div className="space-y-8">
//       <div>
//         <h2 className="text-xl font-semibold text-foreground mb-4">Payments Overview</h2>
//         <div className="bg-card dark:bg-card border border-border rounded-lg overflow-hidden transition-colors">
//           <table className="w-full">
//             <thead className="bg-card dark:bg-card">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Milestone</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Amount</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Due Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Invoice</th>
//               </tr>
//             </thead>
//             <tbody className="bg-card dark:bg-card divide-y divide-border">
//               {payments.map(payment => (
//                 <tr key={payment.id} className="hover:bg-muted dark:hover:bg-card/80">
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {payment.milestone}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-right text-foreground bg-card dark:bg-card border-b border-border">
//                     ${payment.amount.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
//                       payment.status === 'Completed'
//                         ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
//                         : payment.status === 'In Escrow'
//                         ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
//                         : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
//                     }`}>
//                       {payment.status}
//                     </span>
//                     {payment.status === 'In Escrow' && (
//                       <div className="mt-2 flex gap-2">
//                         <TooltipProvider>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <button
//                                 className="text-blue-600 dark:text-blue-400 underline text-xs hover:text-blue-800 focus:outline-none"
//                                 onClick={() => handleRequestFundRelease(payment.id)}
//                               >
//                                 Request Release
//                               </button>
//                             </TooltipTrigger>
//                             <TooltipContent>Request fund release</TooltipContent>
//                           </Tooltip>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <button
//                                 className="text-red-600 dark:text-red-400 underline text-xs hover:text-red-800 focus:outline-none"
//                                 onClick={() => handleDispute(payment.id)}
//                               >
//                                 Dispute
//                               </button>
//                             </TooltipTrigger>
//                             <TooltipContent>Dispute this payment</TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {new Date(payment.dueDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {payment.invoiceNumber}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <div>
//         <h2 className="text-xl font-semibold text-foreground mb-4">Contracts</h2>
//         <div className="bg-card dark:bg-card border border-border rounded-lg overflow-hidden transition-colors">
//           <table className="w-full">
//             <thead className="bg-card dark:bg-card">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">E-Signature</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Sent</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Signed</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Download</th>
//               </tr>
//             </thead>
//             <tbody className="bg-card dark:bg-card divide-y divide-border">
//               {/* Engagement Letter(s) section */}
//               {contracts.filter(c => c.type === 'Engagement Letter').length > 0 && (
//                 <tr className="bg-blue-50 dark:bg-blue-900">
//                   <td colSpan={7} className="px-6 py-2 text-blue-700 dark:text-blue-200 font-semibold">Engagement Letter(s)</td>
//                 </tr>
//               )}
//               {contracts.filter(c => c.type === 'Engagement Letter').map(contract => (
//                 <tr key={contract.id} className="hover:bg-muted dark:hover:bg-card/80">
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {contract.name}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {contract.type}
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
//                       contract.status === 'Signed'
//                         ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
//                         : contract.status === 'Sent'
//                         ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
//                         : contract.status === 'Draft'
//                         ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
//                         : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
//                     }`}>
//                       {contract.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     <button
//                       className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
//                         (signatureStatus[contract.id] || 'Pending Signature') === 'Signed'
//                           ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300' :
//                         (signatureStatus[contract.id] || 'Pending Signature') === 'Declined'
//                           ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300' :
//                           'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300'
//                       }`}
//                       onClick={() => handleToggleSignature(contract.id)}
//                     >
//                       {(signatureStatus[contract.id] || 'Pending Signature')}
//                     </button>
//                     {contract.status === 'Signed' && (
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <button
//                               className="text-blue-600 dark:text-blue-400 underline text-xs hover:text-blue-800 ml-2 focus:outline-none"
//                               onClick={() => handleRequestAmendment(contract.id)}
//                             >
//                               Request Amendment
//                             </button>
//                           </TooltipTrigger>
//                           <TooltipContent>Request amendment for this letter</TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {contract.sentDate ? new Date(contract.sentDate).toLocaleDateString() : '-'}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {contract.signedDate ? new Date(contract.signedDate).toLocaleDateString() : '-'}
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     <a href={contract.downloadUrl} download className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
//                       <Download className="h-4 w-4" /> Download
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//               {/* Other contracts section */}
//               {contracts.filter(c => c.type !== 'Engagement Letter').length > 0 && (
//                 <tr className="bg-gray-50 dark:bg-gray-800">
//                   <td colSpan={7} className="px-6 py-2 text-gray-700 dark:text-gray-200 font-semibold">Other Contracts</td>
//                 </tr>
//               )}
//               {contracts.filter(c => c.type !== 'Engagement Letter').map(contract => (
//                 <tr key={contract.id} className="hover:bg-muted dark:hover:bg-card/80">
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {contract.name}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {contract.type}
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
//                       contract.status === 'Signed'
//                         ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
//                         : contract.status === 'Sent'
//                         ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
//                         : contract.status === 'Draft'
//                         ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
//                         : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
//                     }`}>
//                       {contract.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     <button
//                       className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
//                         (signatureStatus[contract.id] || 'Pending Signature') === 'Signed'
//                           ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300' :
//                         (signatureStatus[contract.id] || 'Pending Signature') === 'Declined'
//                           ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300' :
//                           'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300'
//                       }`}
//                       onClick={() => handleToggleSignature(contract.id)}
//                     >
//                       {(signatureStatus[contract.id] || 'Pending Signature')}
//                     </button>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {contract.sentDate ? new Date(contract.sentDate).toLocaleDateString() : '-'}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {contract.signedDate ? new Date(contract.signedDate).toLocaleDateString() : '-'}
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     <a href={contract.downloadUrl} download className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
//                       <Download className="h-4 w-4" /> Download
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {/* Amendment Request Modal */}
//         <Dialog open={showAmendmentModal} onOpenChange={setShowAmendmentModal}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Request Amendment for Engagement Letter</DialogTitle>
//             </DialogHeader>
//             <div className="mb-4">
//               <textarea
//                 className="w-full border border-border rounded-lg p-2 min-h-[100px]"
//                 placeholder="Describe the amendment you are requesting..."
//                 value={amendmentText}
//                 onChange={e => setAmendmentText(e.target.value)}
//               />
//             </div>
//             <DialogFooter>
//               <Button onClick={handleSubmitAmendment} disabled={!amendmentText.trim()}>
//                 Submit Amendment Request
//               </Button>
//               <DialogClose asChild>
//                 <Button variant="outline">Cancel</Button>
//               </DialogClose>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//       <div>
//         <h2 className="text-xl font-semibold text-foreground mb-4">Deliverables</h2>
//         <div className="bg-card dark:bg-card border border-border rounded-lg overflow-hidden transition-colors">
//           <table className="w-full">
//             <thead className="bg-card dark:bg-card">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">File Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-card dark:bg-card border-b border-border uppercase tracking-wider">Download</th>
//               </tr>
//             </thead>
//             <tbody className="bg-card dark:bg-card divide-y divide-border">
//               {mockDeliverables.map(file => (
//                 <tr key={file.name} className="hover:bg-muted dark:hover:bg-card/80">
//                   <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
//                     {file.name}
//                   </td>
//                   <td className="px-6 py-4 text-sm">
//                     <a href={file.url} download className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
//                       <Download className="h-4 w-4" /> Download
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentsContractsTab; 