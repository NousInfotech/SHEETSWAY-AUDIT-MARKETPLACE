'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Import Lucide icons
import {
  ChevronLeft,
  DollarSign,
  File as FileIcon,
  Calendar as CalendarIcon,
  UploadCloud
} from 'lucide-react';

// Import Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import PageContainer from '@/components/layout/page-container'; // Make sure this path is correct

// Zod schema
const formSchema = z.object({
  businessId: z.string().uuid('Invalid business ID format'),
  type: z.enum(['AUDIT', 'TAX'], {
    required_error: 'Request type is required.'
  }),
  framework: z.enum(['GAPSME', 'IFRS'], {
    required_error: 'You need to select a framework.'
  }),
  financialYear: z.string().min(1, 'Financial year is required'),
  auditStart: z.string().datetime().optional(),
  auditEnd: z.string().datetime().optional(),
  deadline: z.string().datetime('Invalid deadline format'),
  notes: z.string().min(1, 'Notes are required'),
  urgency: z.enum(['NORMAL', 'URGENT'], {
    required_error: 'Urgency is required.'
  }),
  budget: z.number().min(0, 'Budget must be 0 or greater').optional(),
  isAnonymous: z.boolean().default(false),
  isActive: z.boolean().default(true),
  preferredLanguages: z.array(z.string()).min(1, 'At least one preferred language is required'),
  timeZone: z.string().optional(),
  workingHours: z.string().optional(),
  specialFlags: z.array(z.string()).optional(),
});

type AuditFormValues = z.infer<typeof formSchema>;

const RequestPage = () => {
  const [step, setStep] = useState<'selection' | 'auditForm' | 'taxForm'>('selection');

  const form = useForm<AuditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isAnonymous: false,
      isActive: true,
      preferredLanguages: [],
      specialFlags: [],
      urgency: 'NORMAL',
      notes: '',
    },
    mode: 'onChange',
  });

  function onSubmit(data: AuditFormValues) {
    // ... your submit logic
    console.log('Form submitted:', data);
    toast.success('Request Submitted!');
    form.reset();
    setStep('selection');
  }

  // --- Render Functions ---

  const renderSelectionStep = () => (
    <div className='flex min-h-screen min-w-xs flex-1 flex-col md:min-w-xl lg:min-w-6xl'>
      <div className='flex h-full w-full items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-2 text-3xl font-bold tracking-tight'>
            Create a New Request
          </h2>
          <p className='text-muted-foreground mb-8'>
            What type of service do you need?
          </p>
          <div className='flex flex-col justify-center gap-6 md:flex-row'>
            <Card
              onClick={() => setStep('auditForm')}
              className='group hover:border-primary w-full transform cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:w-64'
            >
              <CardHeader className='items-center'>
                <FileIcon className='text-primary mb-4 h-12 w-12 transition-transform duration-300 group-hover:scale-110' />
                <CardTitle>Financial Audit</CardTitle>
                <CardDescription>(GAPSME / IFRS)</CardDescription>
              </CardHeader>
            </Card>
            <Card
              onClick={() => setStep('taxForm')}
              className='group hover:border-primary w-full transform cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:w-64'
            >
              <CardHeader className='items-center'>
                <DollarSign className='text-primary mb-4 h-12 w-12 transition-transform duration-300 group-hover:scale-110' />
                <CardTitle>Tax Return Filing</CardTitle>
                <CardDescription>(Standalone Service)</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuditForm = () => (
    <div className='mx-auto w-full max-w-4xl'>
      <Button variant='ghost' onClick={() => setStep('selection')} className='mb-6'>
        <ChevronLeft className='mr-2 h-4 w-4' /> Back to selection
      </Button>
      <h2 className='mb-6 text-3xl font-bold tracking-tight'>Financial Audit Request</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            {/* Business ID */}
            <FormField
              control={form.control}
              name='businessId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business ID</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='Enter business UUID' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Type */}
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Type</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-row items-center space-x-6'>
                      <FormItem className='flex items-center space-y-0 space-x-2'>
                        <FormControl><RadioGroupItem value='AUDIT' /></FormControl>
                        <FormLabel className='font-normal'>Audit</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-y-0 space-x-2'>
                        <FormControl><RadioGroupItem value='TAX' /></FormControl>
                        <FormLabel className='font-normal'>Tax</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Framework */}
            <FormField
              control={form.control}
              name='framework'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Framework</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-row items-center space-x-6'>
                      <FormItem className='flex items-center space-y-0 space-x-2'>
                        <FormControl><RadioGroupItem value='GAPSME' /></FormControl>
                        <FormLabel className='font-normal'>GAPSME</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-y-0 space-x-2'>
                        <FormControl><RadioGroupItem value='IFRS' /></FormControl>
                        <FormLabel className='font-normal'>IFRS</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Financial Year */}
            <FormField
              control={form.control}
              name='financialYear'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Year</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='e.g. 2023' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Audit Start */}
            <FormField
              control={form.control}
              name='auditStart'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audit Start (optional)</FormLabel>
                  <FormControl>
                    <Input type='datetime-local' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Audit End */}
            <FormField
              control={form.control}
              name='auditEnd'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audit End (optional)</FormLabel>
                  <FormControl>
                    <Input type='datetime-local' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Deadline */}
            <FormField
              control={form.control}
              name='deadline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type='datetime-local' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Notes */}
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Notes / Requirements</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Add any specific notes or requirements for this audit...' className='resize-y' rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Urgency */}
            <FormField
              control={form.control}
              name='urgency'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgency Level</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-row items-center space-x-6'>
                      <FormItem className='flex items-center space-y-0 space-x-2'>
                        <FormControl><RadioGroupItem value='NORMAL' /></FormControl>
                        <FormLabel className='font-normal'>Normal</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-y-0 space-x-2'>
                        <FormControl><RadioGroupItem value='URGENT' /></FormControl>
                        <FormLabel className='font-normal'>Urgent</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Budget */}
            <FormField
              control={form.control}
              name='budget'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (Optional)</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='0.00' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Is Anonymous */}
            <FormField
              control={form.control}
              name='isAnonymous'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submit as Anonymous?</FormLabel>
                  <FormControl>
                    <input type='checkbox' checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Is Active */}
            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Active?</FormLabel>
                  <FormControl>
                    <input type='checkbox' checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Preferred Languages */}
            <FormField
              control={form.control}
              name='preferredLanguages'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Languages</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='Comma separated, e.g. English,Spanish' value={field.value.join(',')} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Time Zone */}
            <FormField
              control={form.control}
              name='timeZone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Zone (Optional)</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='e.g. Europe/Malta' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Working Hours */}
            <FormField
              control={form.control}
              name='workingHours'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working Hours (Optional)</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='e.g. 9am-5pm' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Special Flags */}
            <FormField
              control={form.control}
              name='specialFlags'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Flags (Optional)</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='Comma separated, e.g. urgent,priority' value={field.value?.join(',') || ''} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex justify-end pb-8'>
            <Button type='submit' size='lg'>Submit Request</Button>
          </div>
        </form>
      </Form>
    </div>
  );

  const renderTaxForm = () => (
    <div className='flex h-full flex-col items-center justify-center text-center'>
      <div>
        <Button
          variant='ghost'
          onClick={() => setStep('selection')}
          className='mb-6'
        >
          <ChevronLeft className='mr-2 h-4 w-4' /> Back to selection
        </Button>
        <Card>
          <CardHeader>
            <DollarSign className='text-primary mx-auto mb-4 h-16 w-16' />
            <CardTitle className='text-2xl'>Tax Return Filing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              This feature is coming soon!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <PageContainer>
      {step === 'selection' && renderSelectionStep()}
      {step === 'auditForm' && renderAuditForm()}
      {step === 'taxForm' && renderTaxForm()}
    </PageContainer>
  );
};

export default RequestPage;
