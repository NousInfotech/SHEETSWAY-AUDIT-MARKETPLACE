// src/components/ConnectBankCard.tsx (or a suitable path)

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Landmark, Loader2, ShieldCheck } from "lucide-react";

// Define the props the component will accept
interface ConnectBankCardProps {
  isLoading: boolean;
  onConnect: () => void;
}

export function ConnectBankCard({ isLoading, onConnect }: ConnectBankCardProps) {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="h-6 w-6" />
          <span>Connect Your Bank Account</span>
        </CardTitle>
        <CardDescription>
          Securely link your bank account using Salt Edge to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            By connecting your account, you agree to grant read-only access.
            We will never have access to your credentials.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Bank-level security</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Your data is encrypted</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>You can disconnect at any time</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onConnect} disabled={isLoading} size="lg">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Connecting..." : "Connect Bank Account"}
        </Button>
      </CardFooter>
    </Card>
  );
}