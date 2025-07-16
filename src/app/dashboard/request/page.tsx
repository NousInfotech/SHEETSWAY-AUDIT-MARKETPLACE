'use client';

import { useState, useEffect } from 'react';
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
import axios from '@/lib/axios';
import { API } from '@/config/api';

// Zod schema
const formSchema = z.object({
  businessId: z.string().uuid('Invalid business ID format'),
  plaidAccountId: z.string().uuid('Invalid Plaid account ID format'),
  type: z.enum(['AUDIT', 'TAX'], {
    required_error: 'Request type is required.'
  }),
  framework: z.enum(['GAPSME', 'IFRS'], {
    required_error: 'You need to select a framework.'
  }),
  financialYear: z.string().min(1, 'Financial year is required'),
  auditStart: z.string().optional().transform(val => val ? new Date(val).toISOString() : undefined),
  auditEnd: z.string().optional().transform(val => val ? new Date(val).toISOString() : undefined),
  deadline: z.string().transform(val => new Date(val).toISOString()),
  notes: z.string().min(1, 'Notes are required'),
  urgency: z.enum(['NORMAL', 'URGENT'], {
    required_error: 'Urgency is required.'
  }),
  budget: z.preprocess(val => val === '' ? undefined : Number(val), z.number().min(0, 'Budget must be 0 or greater').optional()),
  isAnonymous: z.boolean().default(false),
  isActive: z.boolean().default(true),
  preferredLanguages: z.array(z.string()).min(1, 'At least one preferred language is required'),
  timeZone: z.string().optional(),
  workingHours: z.string().optional(),
  specialFlags: z.array(z.string()).optional(),
  // Tax form fields
  taxYear: z.string().min(4, 'Tax year is required').optional(),
  filingType: z.enum(['INDIVIDUAL', 'CORPORATE']).optional(),
  incomeSources: z.string().optional(),
});

type AuditFormValues = z.infer<typeof formSchema> & {
  taxYear?: string;
  filingType?: 'INDIVIDUAL' | 'CORPORATE';
  incomeSources?: string;
};

const RequestPage = () => {
  const [step, setStep] = useState<'selection' | 'auditForm' | 'taxForm'>('selection');
  const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);
  const [plaidAccounts, setPlaidAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDropdownData() {
      setLoading(true);
      try {
        const [bpRes, plaidRes] = await Promise.all([
          axios.get(API.BUSINESS_PROFILES),
          axios.get(API.PLAID_ACCOUNTS),
        ]);
        console.log('Full businessProfiles axios response:', bpRes);
        console.log('Full plaidAccounts axios response:', plaidRes);
        setBusinessProfiles(
          Array.isArray(bpRes.data?.data)
            ? bpRes.data.data
            : Array.isArray(bpRes.data)
              ? bpRes.data
              : []
        );
        setPlaidAccounts(
          Array.isArray(plaidRes.data?.data)
            ? plaidRes.data.data
            : Array.isArray(plaidRes.data)
              ? plaidRes.data
              : []
        );
      } catch (err) {
        toast.error('Failed to load dropdown data');
      } finally {
        setLoading(false);
      }
    }
    fetchDropdownData();
  }, []);

  const form = useForm<AuditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessId: '',
      plaidAccountId: '',
      isAnonymous: false,
      isActive: true,
      preferredLanguages: [],
      specialFlags: [],
      urgency: 'NORMAL',
      notes: '',
      // Tax form defaults
      taxYear: '',
      filingType: 'INDIVIDUAL',
      incomeSources: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: AuditFormValues) {
    // Frontend validation for required fields
    if (!data.businessId) {
      toast.error('Please select a business profile.');
      return;
    }
    if (!data.plaidAccountId) {
      toast.error('Please select a Plaid bank account.');
      return;
    }
    // Optionally, check for authentication if you have access to user context
    // if (!user) {
    //   toast.error('You must be logged in to submit a request.');
    //   return;
    // }
    try {
      await axios.post(API.CLIENT_REQUESTS, data);
      toast.success('Form submitted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      toast.error('Form send failed, try again later.');
    }
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

  const renderAuditForm = () => {
    console.log('Rendering dropdowns', businessProfiles, plaidAccounts);
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Button variant='ghost' onClick={() => setStep('selection')} className='mb-6'>
          <ChevronLeft className='mr-2 h-4 w-4' /> Back to selection
        </Button>
        <h2 className='mb-6 text-3xl font-bold tracking-tight'>Financial Audit Request</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              {/* Business Profile Dropdown */}
              <FormField
                control={form.control}
                name='businessId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Profile</FormLabel>
                    <FormControl>
                      {loading ? (
                        <Input disabled placeholder='Loading...'/>
                      ) : businessProfiles.length === 0 ? (
                        <Input disabled placeholder='No business profiles found'/>
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select a business profile' />
                          </SelectTrigger>
                          <SelectContent>
                            {businessProfiles.map((bp) => (
                              <SelectItem key={bp.id} value={bp.id}>
                                {bp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Plaid Account Dropdown */}
              <FormField
                control={form.control}
                name='plaidAccountId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plaid Bank Account</FormLabel>
                    <FormControl>
                      {loading ? (
                        <Input disabled placeholder='Loading...'/>
                      ) : plaidAccounts.length === 0 ? (
                        <Input disabled placeholder='No Plaid accounts found'/>
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select a Plaid account' />
                          </SelectTrigger>
                          <SelectContent>
                            {plaidAccounts.map((pa) => (
                              <SelectItem key={pa.id} value={pa.id}>
                                {pa.institution} - {pa.accountName} ({pa.last4})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
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
  };

  const renderTaxForm = () => (
    <div className='mx-auto w-full max-w-4xl'>
      <Button variant='ghost' onClick={() => setStep('selection')} className='mb-6'>
        <ChevronLeft className='mr-2 h-4 w-4' /> Back to selection
      </Button>
      <h2 className='mb-6 text-3xl font-bold tracking-tight'>Tax Return Filing</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            {/* Business Profile Dropdown */}
            <FormField
              control={form.control}
              name='businessId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Profile</FormLabel>
                  <FormControl>
                    {loading ? (
                      <Input disabled placeholder='Loading...' />
                    ) : businessProfiles.length === 0 ? (
                      <Input disabled placeholder='No business profiles found' />
                    ) : (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select a business profile' />
                        </SelectTrigger>
                        <SelectContent>
                          {businessProfiles.map((bp) => (
                            <SelectItem key={bp.id} value={bp.id}>
                              {bp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tax Year */}
            <FormField
              control={form.control}
              name='taxYear'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Year</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='e.g. 2023' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Filing Type */}
            <FormField
              control={form.control}
              name='filingType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filing Type</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-row items-center space-x-6'>
                      <FormItem className='flex items-center space-y-0 space-x-2'>
                        <FormControl><RadioGroupItem value='INDIVIDUAL' /></FormControl>
                        <FormLabel className='font-normal'>Individual</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-y-0 space-x-2'>
                        <FormControl><RadioGroupItem value='CORPORATE' /></FormControl>
                        <FormLabel className='font-normal'>Corporate</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Income Sources */}
            <FormField
              control={form.control}
              name='incomeSources'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Income Sources</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='e.g. Salary, Business, Investments' {...field} />
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
                    <Textarea placeholder='Add any specific notes or requirements for this tax return...' className='resize-y' rows={4} {...field} />
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
            <Button type='submit' size='lg'>Submit Tax Return</Button>
          </div>
        </form>
      </Form>
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
