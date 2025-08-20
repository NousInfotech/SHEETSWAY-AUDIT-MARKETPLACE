
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// This is your API function to create a milestone
import { createMilestone } from '@/api/engagement';

// Define the form validation schema using Zod
const milestoneFormSchema = z.object({
  label: z.string().min(3, { message: 'Label must be at least 3 characters long.' }),
  dueDate: z.date().optional(),
  // Add other fields you want to set from the form
});

type MilestoneFormValues = z.infer<typeof milestoneFormSchema>;

interface CreateMilestoneDialogProps {
  engagementId: string;
  auditorId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onMilestoneCreated: () => void; // Callback to refresh the list
}

export function CreateMilestoneDialog({
  engagementId,
  auditorId,
  isOpen,
  onOpenChange,
  onMilestoneCreated,
}: CreateMilestoneDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MilestoneFormValues>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: {
      label: '',
    },
  });

  async function onSubmit(data: MilestoneFormValues) {
    setIsSubmitting(true);
    try {
      // Construct the payload for your API
      const payload = {
        ...data,
        engagementId,
        auditorId,
        status: 'not_started', // Default status
        // Convert date to ISO string if it exists
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
        setBy:"CLIENT"
      };

      await createMilestone(payload);
      toast.success('Milestone created successfully!');
      onMilestoneCreated(); // Trigger the refresh
      onOpenChange(false); // Close the dialog
      form.reset();
    } catch (error) {
      console.error('Failed to create milestone:', error);
      toast.error('Failed to create milestone. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Milestone</DialogTitle>
          <DialogDescription>
            Fill in the details for the new milestone. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Finalize Audit Report" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Milestone
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}