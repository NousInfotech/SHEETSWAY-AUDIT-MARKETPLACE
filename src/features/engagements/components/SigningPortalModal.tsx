'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SigningFlowComponent } from '@/features/engagements/components/SigningFlow';
import { ArrowRight } from 'lucide-react';

// Define the props for the controlled modal
interface SigningPortalModalProps {
  selectedEngagement: any | null;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEnterWorkspace: (engagement: any) => void;
}

export function SigningPortalModal({ selectedEngagement, open, onOpenChange, onEnterWorkspace }: SigningPortalModalProps) {
  return (
    // The Dialog's visibility is now controlled by the `open` and `onOpenChange` props
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] min-w-6xl  h-[95vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>E-Signature Portal</DialogTitle>
        </DialogHeader>

        {/* The main content area is now padded and scrollable */}
        <div className="flex-grow overflow-y-auto overflow-x-hidden p-6">
          <SigningFlowComponent />
        </div>

        {/* 5. Add the DialogFooter for the bottom button */}
        <DialogFooter className="p-6 border-t bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <Button onClick={() => onEnterWorkspace(selectedEngagement)}>
            Enter Workspace
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}