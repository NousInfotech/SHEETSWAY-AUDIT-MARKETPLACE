import { ArrowRight, CreditCard } from 'lucide-react';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// --- Type Definitions for Props ---
// Define a type for the engagement data the modal needs
interface EngagementData {
  request: {
    title: string;
  };
  auditor: {
    name: string;
  };
  proposal: {
    quotation: number;
    currency: string;
  };
}

// Define the props for the modal component
interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  engagement: any;
  handlePayment: (id: string) => Promise<void>
  isProcessing: boolean;
}

// --- The Reusable Modal Component ---
const PaymentModal = ({
  isOpen,
  onOpenChange,
  engagement,
  handlePayment,
  isProcessing,
}: PaymentModalProps) => {
  // Defensive check in case engagement data is not available
  if (!engagement) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <CreditCard className="mr-3 h-6 w-6 text-blue-600" />
            Payment Summary
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
            <span>Project:</span>
            <span className="font-medium text-right text-foreground">
              {engagement.request.title}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
            <span>Billed by:</span>
            <span className="font-medium text-right text-foreground">
              {engagement.auditor.name}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-lg font-semibold text-foreground">
            <span>Total Amount:</span>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: engagement.proposal.currency,
              }).format(engagement.proposal.quotation)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            You will be redirected to Stripe's secure checkout page to complete
            your payment.
          </p>
        </div>
        <Button
          onClick={() => handlePayment(engagement.id)}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Processing...' : 'Pay with Stripe'}
          {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;