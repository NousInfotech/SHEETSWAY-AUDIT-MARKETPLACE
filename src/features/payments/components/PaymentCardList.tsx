// features/payments/components/PaymentCardList.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  CheckCircle2,
  XCircle,
  Hourglass,
  Circle,
  Landmark,
  CalendarDays,
} from "lucide-react";
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
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Helper to get color-coded status styles
const getStatusStyles = (status: string): { variant: BadgeVariant; className: string; Icon: React.ElementType } => {
    switch (status.toLowerCase()) {
      case 'recieved':
        return { variant: "outline", className: "text-green-600 border-green-600 bg-green-50", Icon: CheckCircle2 };
      default:
        return { variant: "secondary", className: "text-gray-600", Icon: Circle };
    }
};

export function PaymentCardList({ payments }: PaymentListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
      </div>
      {payments.map((payment) => {
        const { variant, className, Icon } = getStatusStyles(payment.status);
        return (
          <Card key={payment.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Left Side: Icon and Amount */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Landmark className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Engagement ID: {payment.paymentMeta.engagementId.substring(0, 8)}...
                    </p>
                  </div>
                </div>

                {/* Middle: Date and Status */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground md:justify-center">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatDate(payment.createdAt)}</span>
                    </div>
                     <Badge variant={variant} className={`capitalize ${className}`}>
                        <Icon className="mr-1 h-3 w-3" />
                        {payment.status}
                    </Badge>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Button variant="outline" size="sm">View Details</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                      <DropdownMenuItem>Report an Issue</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}