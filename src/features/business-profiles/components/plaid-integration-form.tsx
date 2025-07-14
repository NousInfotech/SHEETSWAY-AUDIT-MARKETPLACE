import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { generateMockPlaidIntegration } from '../utils/mock-data';

export default function PlaidIntegrationForm({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: () => void; }) {
  function handleSimulate() {
    onSubmit();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Plaid</DialogTitle>
        </DialogHeader>
        <div className="py-4">Plaid Link flow would start here.</div>
        <DialogFooter>
          <Button onClick={handleSimulate}>Simulate Connect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 