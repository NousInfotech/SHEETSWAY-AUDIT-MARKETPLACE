// features/payments/components/PaymentAccordionList.tsx

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Circle } from "lucide-react";
import { Payment } from "@/features/payments/types/payment";
import { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

interface PaymentListProps {
  payments: Payment[];
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


const getStatusStyles = (status: string): { variant: BadgeVariant; className: string; Icon: React.ElementType } => {
    switch (status.toLowerCase()) {
      case 'recieved':
        return { variant: "outline", className: "text-green-600 border-green-600 bg-green-50", Icon: CheckCircle2 };
      default:
        return { variant: "secondary", className: "text-gray-600", Icon: Circle };
    }
};

export function PaymentAccordionList({ payments }: PaymentListProps) {
  return (
    <div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Recent Transactions</h2>
        <Accordion type="single" collapsible className="w-full">
        {payments.map((payment) => {
            const { variant, className, Icon } = getStatusStyles(payment.status);
            return (
            <AccordionItem key={payment.id} value={payment.id}>
                <AccordionTrigger>
                <div className="flex w-full items-center justify-between pr-4">
                    <div className="text-left">
                        <p className="font-bold text-lg">
                            {formatCurrency(payment.amount, payment.currency)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {formatDate(payment.createdAt)}
                        </p>
                    </div>
                    <Badge variant={variant} className={`capitalize ${className}`}>
                        <Icon className="mr-1 h-3 w-3" />
                        {payment.status}
                    </Badge>
                </div>
                </AccordionTrigger>
                <AccordionContent className="bg-muted/50 p-4 rounded-md">
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div className="font-mono text-xs">
                            <p className="font-semibold text-base">Details</p>
                            <p className="text-muted-foreground">Payment ID: {payment.id}</p>
                            <p className="text-muted-foreground">Stripe ID: {payment.stripePaymentId}</p>
                        </div>
                        <div>
                           <p className="font-semibold text-base">Escrow Status</p>
                            <div className="flex items-center gap-2">
                                <Badge variant={payment.escrow.isReleased ? "secondary" : "destructive"}>
                                    {payment.escrow.isReleased ? "Released" : "In Escrow"}
                                </Badge>
                                 <Badge variant={payment.escrow.underDispute ? "destructive" : "secondary"}>
                                    {payment.escrow.underDispute ? "Under Dispute" : "No Dispute"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <Button variant="link" className="p-0 h-auto mt-4">
                       View Engagement Details
                    </Button>
                </AccordionContent>
            </AccordionItem>
            );
        })}
        </Accordion>
    </div>
  );
}