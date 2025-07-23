import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Globe, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuditorProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuditorProfileModal({ open, onOpenChange }: AuditorProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Auditor Profile (Anonymous View)
            <Badge variant="outline" className="ml-2 flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Vetted Auditor — Verified by Sheetsway
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> Licensed in Germany, France, Malta</span>
            <span>12 Years Experience | Specializing in IFRS & Group Audits</span>
            <span>Boutique Audit Firm | 3-5 Team Members</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span>Languages: English, German, French</span>
            <span>Avg. Response Time: 2 hours</span>
            <span>Avg. Completion Time: 18 days</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span>47 Successful Engagements via Sheetsway</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /> 4.9 / 5.0 (based on 29 client reviews)</span>
          </div>
          <div className="mt-2">
            <div className="font-semibold mb-1">Most recent audits:</div>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li>IFRS audit for eCommerce company (€22k)</li>
              <li>Consolidated group audit for EU holding company (€48k)</li>
              <li>GAPSME filing for local service provider (€8k)</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 