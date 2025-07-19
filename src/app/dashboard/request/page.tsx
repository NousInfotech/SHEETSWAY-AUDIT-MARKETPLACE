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
import { createClientRequest } from '@/api/client-request.api';
import { getBusinessProfiles, getPlaidBankAccounts, getAccountingIntegrations } from '@/api/user.api';
import { useAuth } from '@/components/layout/providers';
import { generateYearOptions } from '@/lib/utils';

// Zod schema
const formSchema = z.object({
  title: z.string().min(1, "Title for Request is Required"),
  businessId: z.string().uuid('Invalid business ID format'),
  type: z.enum(['AUDIT', 'TAX']),
  framework: z.enum(['GAPSME', 'IFRS']),
  financialYear: z.string().min(1, 'Financial year is required'),
  auditStart: z.preprocess(
    (val) => (typeof val === 'string' && val ? new Date(val).toISOString() : undefined),
    z.string().datetime().optional()
  ),
  auditEnd: z.preprocess(
    (val) => (typeof val === 'string' && val ? new Date(val).toISOString() : undefined),
    z.string().datetime().optional()
  ),
  deadline: z.preprocess(
    (val) => (typeof val === 'string' && val ? new Date(val).toISOString() : undefined),
    z.string().datetime('Invalid deadline format')
  ),
  notes: z.string().min(1, 'Notes are required'),
  urgency: z.enum(['NORMAL', 'URGENT']),
  budget: z.preprocess(
    (val) => val === '' ? undefined : Number(val),
    z.number().min(0, 'Budget must be 0 or greater').optional()
  ),
  isAnonymous: z.boolean().default(false),
  isActive: z.boolean().default(true),
  preferredLanguages: z.array(z.string()).min(1, 'At least one preferred language is required'),
  timeZone: z.string().optional(),
  workingHours: z.string().optional(),
  specialFlags: z.array(z.string()).optional(),
  accountingIntegrationId: z.string().min(1, 'Please select an accounting integration').optional(),
  plaidIntegrationId: z.string().min(1, 'Please select an plaid integration').optional(),
});

type AuditFormValues = z.infer<typeof formSchema>;

const RequestPage = () => {

  const { appUser } = useAuth();

  const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);
  const [plaidAccounts, setPlaidAccounts] = useState<any[]>([]);
  const [selectedPlaidAccountId, setSelectedPlaidAccountId] = useState<string>('');
  const [accountingIntegrations, setAccountingIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDropdownData() {
      if (!appUser?.id) return; // ✅ guard *inside* the effect

      setLoading(true);
      try {
        const filter = { userId: appUser.id };
        const [bpRes, plaidRes, apideckRes] = await Promise.all([
          getBusinessProfiles(filter),
          getPlaidBankAccounts(filter),
          getAccountingIntegrations(filter),
        ]);

        console.log('Business profiles:', bpRes);
        console.log('Plaid accounts:', plaidRes);
        console.log('Apideck integrations:', apideckRes);

        setBusinessProfiles(Array.isArray(bpRes) ? bpRes : []);
        setPlaidAccounts(Array.isArray(plaidRes) ? plaidRes : []);
        setAccountingIntegrations(Array.isArray(apideckRes) ? apideckRes : []);
      } catch (err) {
        toast.error('Failed to load dropdown data');
        console.error('Dropdown fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDropdownData();
  }, [appUser?.id]); // ✅ refetch when appUser becomes available



  const form = useForm<AuditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      businessId: '',
      type: 'AUDIT',
      framework: 'GAPSME',
      financialYear: '',
      auditStart: '',
      auditEnd: '',
      deadline: '',
      notes: '',
      urgency: 'NORMAL',
      budget: undefined,
      isAnonymous: false,
      isActive: true,
      preferredLanguages: [],
      timeZone: '',
      workingHours: '',
      specialFlags: [],
      plaidIntegrationId: "",
      accountingIntegrationId: '',
    },
    mode: 'onChange',
  });

  console.log('formState.errors', form.formState.errors);

  async function onSubmit(data: AuditFormValues) {
    console.log('onSubmit called', data);
    if (!data.businessId) {
      toast.error('Please select a business profile.');
      return;
    }
    if (!data.plaidIntegrationId) {
      toast.error('Please select a Plaid bank account.');
      return;
    }

    if (!data.accountingIntegrationId) {
      toast.error('Please select an accounting integration.');
      return;
    }
    const payload = {
      ...data,
    };
    try {
      await createClientRequest(payload);
      toast.success('Form submitted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Form submission error:', err);
      toast.error('Form send failed, try again later.');
    }
  }

  // --- Render Functions ---

  // ✅ Safe conditional return
  if (!appUser) {
    return <div>Loading...</div>;
  }

  const renderAuditForm = () => {
    console.log('Rendering dropdowns', businessProfiles, plaidAccounts);
    return (
      <div className='mx-auto w-full max-w-4xl'>

        <h2 className='mb-6 text-3xl font-bold tracking-tight'>Financial Audit Request</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>


              {/* Financial Year */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='title for the request' value={field.value ?? ''} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />              {/* Business Profile Dropdown */}
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

              {/* Plaid Account Dropdown */}
              <FormField
                control={form.control}
                name='plaidIntegrationId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plaid Bank Account</FormLabel>
                    <FormControl>
                      {loading ? (
                        <Input disabled placeholder='Loading...' />
                      ) : plaidAccounts.length === 0 ? (
                        <Input disabled placeholder='No Plaid accounts found' />
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
              < FormField
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select a year' />
                        </SelectTrigger>
                        <SelectContent>
                          {generateYearOptions(2015, 2030).map((year) => {
                            const value = new Date(`${year}-01-01T00:00:00.000Z`).toISOString(); // full ISO string
                            return (
                              <SelectItem key={year} value={value}>
                                {year} {/* show only year */}
                              </SelectItem>
                            );
                          })}

                        </SelectContent>
                      </Select>
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
                      <Input type='datetime-local' value={field.value ?? ''} onChange={field.onChange} />
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
                      <Input type='datetime-local' value={field.value ?? ''} onChange={field.onChange} />
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
                      <Input type='datetime-local' value={field.value ?? ''} onChange={field.onChange} />
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
                      <Textarea placeholder='Add any specific notes or requirements for this audit...' className='resize-y' rows={4} value={field.value ?? ''} onChange={field.onChange} />
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
                      <Input type='number' placeholder='0.00' value={field.value ?? ''} onChange={field.onChange} />
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
                      <input type='checkbox' checked={!!field.value} onChange={e => field.onChange(e.target.checked)} />
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
                      <input type='checkbox' checked={!!field.value} onChange={e => field.onChange(e.target.checked)} />
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
                      <Input type='text' placeholder='Comma separated, e.g. English,Spanish' value={Array.isArray(field.value) ? field.value.join(',') : ''} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
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
                      <Input type='text' placeholder='e.g. Europe/Malta' value={field.value ?? ''} onChange={field.onChange} />
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
                      <Input type='text' placeholder='e.g. 9am-5pm' value={field.value ?? ''} onChange={field.onChange} />
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
                      <Input type='text' placeholder='Comma separated, e.g. urgent,priority' value={Array.isArray(field.value) ? field.value.join(',') : ''} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Accounting Integration */}
              <FormField
                control={form.control}
                name='accountingIntegrationId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Profile</FormLabel>
                    <FormControl>
                      {loading ? (
                        <Input disabled placeholder='Loading...' />
                      ) : accountingIntegrations.length === 0 ? (
                        <Input disabled placeholder='No Accounting Profile is Found' />
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select a Accounting profile' />
                          </SelectTrigger>
                          <SelectContent>
                            {accountingIntegrations.map((ac) => (
                              <SelectItem key={ac.id} value={ac.id}>
                                {ac.serviceId}
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
            </div>
            <div className='flex justify-end pb-8'>
              <button
                type='button'
                style={{ padding: '12px 32px', fontSize: '1.125rem', fontWeight: 600, borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  console.log('Button clicked');
                  const handler = form.handleSubmit((data) => {
                    console.log('form.handleSubmit called');
                    onSubmit(data);
                  });
                  handler();
                }}
              >
                Submit Request
              </button>
            </div>
          </form>
        </Form>
      </div >
    );
  };



  return (
    <PageContainer>
      {renderAuditForm()}

    </PageContainer>
  );
};

export default RequestPage;
