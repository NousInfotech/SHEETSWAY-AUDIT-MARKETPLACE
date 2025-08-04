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
  UploadCloud,
  CheckIcon
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
import {
  createClientRequest,
  getPresignedAccessUrl
} from '@/api/client-request.api';
import {
  getBusinessProfiles,
  getPlaidBankAccounts,
  getAccountingIntegrations
} from '@/api/user.api';
import { useAuth } from '@/components/layout/providers';
import { generateYearOptions } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { FileUploader } from '@/components/file-uploader';
import { getSignedUploadUrl } from '@/api/client-request.api';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Zod schema
const formSchema = z.object({
  title: z.string().min(1, 'Title for Request is Required'),
  businessId: z.string().uuid('Invalid business ID format'),
  type: z.enum(['AUDIT', 'TAX']),
  framework: z.enum(['GAPSME', 'IFRS']),
  financialYear: z.string().min(1, 'Financial year is required'),
  auditStart: z.preprocess(
    (val) =>
      typeof val === 'string' && val ? new Date(val).toISOString() : undefined,
    z.string().datetime().optional()
  ),
  auditEnd: z.preprocess(
    (val) =>
      typeof val === 'string' && val ? new Date(val).toISOString() : undefined,
    z.string().datetime().optional()
  ),
  deadline: z.preprocess(
    (val) =>
      typeof val === 'string' && val ? new Date(val).toISOString() : undefined,
    z.string().datetime('Invalid deadline format')
  ),
  notes: z.string().min(1, 'Notes are required'),
  urgency: z.enum(['NORMAL', 'URGENT']),
  budget: z.preprocess((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    if (typeof val === 'string' && val.trim() === '') return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().min(0, 'Budget must be 0 or greater').optional()),
  isAnonymous: z.boolean(),
  isActive: z.boolean().default(true),
  preferredLanguages: z.array(z.string()).optional(),
  timeZone: z.string().optional(),
  workingHours: z
    .object({
      startTime: z.string().optional(),
      endTime: z.string().optional()
    })
    .optional(),
  specialFlags: z.array(z.string()).optional(),
  accountingIntegrationId: z.string().optional(),
  plaidIntegrationId: z.string().optional()
});

type AuditFormValues = z.infer<typeof formSchema>;

const LANGUAGES: string[] = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Chinese',
  'Hindi'
];
const TIME_ZONES: string[] = [
  'Europe/Malta',
  'America/New_York',
  'Asia/Kolkata',
  'Europe/London',
  'Asia/Tokyo',
  'Australia/Sydney'
];
const WORKING_HOURS: string[] = ['8am-4pm', '9am-5pm', '10am-6pm', 'Flexible'];
const SPECIAL_FLAGS: string[] = [
  'urgent',
  'priority',
  'confidential',
  'followup'
];

const RequestPage = () => {
  const { appUser } = useAuth();

  const [loadingPreviewKey, setLoadingPreviewKey] = useState<string | null>(
    null
  );

  const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);
  const [plaidAccounts, setPlaidAccounts] = useState<any[]>([]);
  const [selectedPlaidAccountId, setSelectedPlaidAccountId] =
    useState<string>('');
  const [accountingIntegrations, setAccountingIntegrations] = useState<any[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  // Add state for files
  const [files, setFiles] = useState<File[]>([]);
  const [documents, setDocuments] = useState<
    { fileName: string; fileUrl: string; fileKey: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchDropdownData() {
      if (!appUser?.id) return; // ✅ guard *inside* the effect

      setLoading(true);
      try {
        const filter = { userId: appUser.id };
        const [bpRes, plaidRes, apideckRes] = await Promise.all([
          getBusinessProfiles(filter),
          getPlaidBankAccounts(filter),
          getAccountingIntegrations(filter)
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
      title: '',
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
      isAnonymous: true,
      isActive: true,
      preferredLanguages: [],
      timeZone: '',
      workingHours: { startTime: '', endTime: '' },
      specialFlags: [],
      plaidIntegrationId: '',
      accountingIntegrationId: ''
    },
    mode: 'onChange'
  });

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <Spinner size={48} className='text-primary' />
      </div>
    );
  }

  console.log('formState.errors', form.formState.errors);

  async function handleFileUpload(files: File[]) {
    setUploading(true);
    try {
      const uploadedDocs: {
        fileName: string;
        fileUrl: string;
        fileKey: string;
      }[] = [];
      for (const file of files) {
        const { uploadUrl, fileUrl, fileKey } = await getSignedUploadUrl(
          file.name,
          file.type,
          'client-request-documents'
        );
        const s3Response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        });
        if (!s3Response.ok) {
          const errorText = await s3Response.text();
          console.error('S3 upload failed:', s3Response.status, errorText);
          toast.error(`S3 upload failed: ${s3Response.status}`);
          throw new Error('S3 upload failed');
        }
        uploadedDocs.push({ fileName: file.name, fileUrl, fileKey });
      }
      setDocuments((prev) => [...prev, ...uploadedDocs]);
      setFiles([]); // clear files after upload
      toast.success('Files uploaded successfully!');
    } catch (err) {
      toast.error('File upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handlePreview(fileKey: string) {
    // 1. Set the loading state for this specific file
    setLoadingPreviewKey(fileKey);

    try {
      const response = await getPresignedAccessUrl(fileKey);

      const urlToOpen = response.data;

      if (!urlToOpen || typeof urlToOpen !== 'string') {
        throw new Error('Invalid access URL received from server.');
      }

      // 4. Open the extracted URL in a new tab
      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to get preview URL', error);
      toast.error('Could not generate file preview. Please try again.');
    } finally {
      // 5. Reset the loading state regardless of success or failure
      setLoadingPreviewKey(null);
    }
  }
  async function onSubmit(data: AuditFormValues) {
    setSubmitting(true);
    // Prepare specialFlags: if 'other', use the custom value
    let specialFlags: string[] = [];
    if (data.specialFlags && data.specialFlags[0] === 'other') {
      if (data.specialFlags[1]) {
        specialFlags = [data.specialFlags[1]];
      }
    } else if (data.specialFlags && data.specialFlags[0]) {
      specialFlags = [data.specialFlags[0]];
    }
    // Filter out any falsy or non-string values
    specialFlags = specialFlags.filter(
      (flag) => typeof flag === 'string' && flag.length > 0
    );

    // Prepare workingHours as a string 'startTime-endTime' if both are present
    let workingHours = undefined;
    if (
      data.workingHours &&
      data.workingHours.startTime &&
      data.workingHours.endTime
    ) {
      workingHours = `${data.workingHours.startTime}-${data.workingHours.endTime}`;
    }

    // Build payload and remove plaidIntegrationId/accountingIntegrationId if not set
    const payload: any = {
      ...data,
      specialFlags,
      workingHours, // now a string or undefined
      accountingIntegrationId: data.accountingIntegrationId,
      workingHoursStart: undefined,
      workingHoursEnd: undefined,
      documents // <-- now includes fileKey for each document
    };
    if (!data.plaidIntegrationId) {
      delete payload.plaidIntegrationId;
    }
    if (!data.accountingIntegrationId) {
      delete payload.accountingIntegrationId;
    }

    try {
      await createClientRequest(payload);
      toast.success('Form submitted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Form submission error:', err);
      // Show backend error message if available
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Form send failed, try again later.';
      toast.error(backendMsg);
    } finally {
      setSubmitting(false);
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
        {submitting && (
          <div className='bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black'>
            <Spinner size={48} className='text-primary' />
          </div>
        )}
        <h2 className='mb-6 text-3xl font-bold tracking-tight'>
          Financial Audit Request
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              {/* Financial Year */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Title <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='title for the request'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{' '}
              {/* Business Profile Dropdown */}
              <FormField
                control={form.control}
                name='businessId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Profile <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      {loading ? (
                        <Input disabled placeholder='Loading...' />
                      ) : businessProfiles.length === 0 ? (
                        <Input
                          disabled
                          placeholder='No business profiles found'
                        />
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
              {/* Plaid Account and Account Integration Side by Side */}
              {(plaidAccounts.length > 0 ||
                accountingIntegrations.length > 0) && (
                <div className='flex w-full gap-4'>
                  {plaidAccounts.length > 0 && (
                    <div className='min-w-0 flex-1'>
                      <FormField
                        control={form.control}
                        name='plaidIntegrationId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Plaid Bank Account (Optional)</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(val) =>
                                  field.onChange(val === '' ? undefined : val)
                                }
                                value={field.value || ''}
                              >
                                <SelectTrigger
                                  className='w-full min-w-0'
                                  style={{ maxWidth: '100%' }}
                                >
                                  <SelectValue
                                    placeholder='Select a Plaid account'
                                    className='truncate'
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {plaidAccounts.map((pa) => (
                                    <SelectItem key={pa.id} value={pa.id}>
                                      <span className='block max-w-[220px] truncate'>
                                        {pa.institution} - {pa.accountName} (
                                        {pa.last4})
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  {accountingIntegrations.length > 0 && (
                    <div className='min-w-0 flex-1'>
                      <FormField
                        control={form.control}
                        name='accountingIntegrationId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Account Integration (Optional)
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(val) =>
                                  field.onChange(val === '' ? undefined : val)
                                }
                                value={field.value || ''}
                              >
                                <SelectTrigger
                                  className='w-full min-w-0'
                                  style={{ maxWidth: '100%' }}
                                >
                                  <SelectValue
                                    placeholder='Select an Accounting profile'
                                    className='truncate'
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {accountingIntegrations.map((ac) => (
                                    <SelectItem key={ac.id} value={ac.id}>
                                      <span className='block max-w-[220px] truncate'>
                                        {ac.serviceId}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}
              {/* Type */}
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Request Type <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex flex-row items-center space-x-6'
                      >
                        <FormItem className='flex items-center space-y-0 space-x-2'>
                          <FormControl>
                            <RadioGroupItem value='AUDIT' />
                          </FormControl>
                          <FormLabel className='font-normal'>Audit</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center space-y-0 space-x-2'>
                          <FormControl>
                            <RadioGroupItem value='TAX' />
                          </FormControl>
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
                    <FormLabel>
                      Framework <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex flex-row items-center space-x-6'
                      >
                        <FormItem className='flex items-center space-y-0 space-x-2'>
                          <FormControl>
                            <RadioGroupItem value='GAPSME' />
                          </FormControl>
                          <FormLabel className='font-normal'>GAPSME</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center space-y-0 space-x-2'>
                          <FormControl>
                            <RadioGroupItem value='IFRS' />
                          </FormControl>
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
                    <FormLabel>
                      Financial Year <span className='text-red-500'>*</span>
                    </FormLabel>
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
                            const value = new Date(
                              `${year}-01-01T00:00:00.000Z`
                            ).toISOString(); // full ISO string
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
                      <Input
                        type='datetime-local'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
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
                      <Input
                        type='datetime-local'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
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
                    <FormLabel>
                      Deadline <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
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
                    <FormLabel>
                      Notes / Requirements{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Add any specific notes or requirements for this audit...'
                        className='resize-y'
                        rows={4}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
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
                    <FormLabel>
                      Urgency Level <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex flex-row items-center space-x-6'
                      >
                        <FormItem className='flex items-center space-y-0 space-x-2'>
                          <FormControl>
                            <RadioGroupItem value='NORMAL' />
                          </FormControl>
                          <FormLabel className='font-normal'>Normal</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center space-y-0 space-x-2'>
                          <FormControl>
                            <RadioGroupItem value='URGENT' />
                          </FormControl>
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
                      <Input
                        type='number'
                        placeholder='0.00'
                        value={
                          field.value === undefined || field.value === null
                            ? ''
                            : String(field.value)
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === '' ? undefined : e.target.value
                          )
                        }
                      />
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
                    <FormLabel>
                      Submit as Anonymous?{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        // Convert the boolean from the form state to a string for the RadioGroup's value
                        value={String(field.value)}
                        onValueChange={(value) => {
                          // Convert the string "true" or "false" back to a boolean for the form state
                          field.onChange(value === 'true');
                        }}
                        className='flex flex-row items-center space-x-6'
                      >
                        <FormItem className='flex items-center space-y-0 space-x-2'>
                          <RadioGroupItem value='true' id='isAnonymous-yes' />
                          <FormLabel
                            htmlFor='isAnonymous-yes'
                            className='font-normal'
                          >
                            Yes
                          </FormLabel>
                        </FormItem>

                        <FormItem className='flex items-center space-y-0 space-x-2'>
                          <RadioGroupItem value='false' id='isAnonymous-no' />
                          <FormLabel
                            htmlFor='isAnonymous-no'
                            className='font-normal'
                          >
                            No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Is Active */}
              {/* <FormField
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
              /> */}
              {/* Preferred Languages - Multiselect Popover */}
              <FormField
                control={form.control}
                name='preferredLanguages'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Preferred Languages{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type='button'
                            variant='outline'
                            className={
                              'w-full justify-between ' +
                              (field.value && field.value.length > 0
                                ? ''
                                : 'text-muted-foreground')
                            }
                          >
                            {field.value && field.value.length > 0
                              ? field.value.join(', ')
                              : 'Select preferred languages'}
                            <CheckIcon className='ml-2 h-4 w-4 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-64 p-2'>
                          <div className='flex max-h-48 flex-col gap-2 overflow-y-auto'>
                            {LANGUAGES.map((lang) => (
                              <label
                                key={lang}
                                className='flex cursor-pointer items-center gap-2'
                              >
                                <input
                                  type='checkbox'
                                  checked={field.value?.includes(lang) || false}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.onChange([
                                        ...(field.value || []),
                                        lang
                                      ]);
                                    } else {
                                      field.onChange(
                                        (field.value || []).filter(
                                          (l: string) => l !== lang
                                        )
                                      );
                                    }
                                  }}
                                />
                                <span>{lang}</span>
                              </label>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select a time zone' />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_ZONES.map((tz: string) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Working Hours - Start and End Time Selectors */}
              <div className='flex gap-4'>
                <div className='flex-1'>
                  <FormField
                    control={form.control}
                    name='workingHours.startTime'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working Hours Start</FormLabel>
                        <FormControl>
                          <Input
                            type='time'
                            value={field.value || ''}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex-1'>
                  <FormField
                    control={form.control}
                    name='workingHours.endTime'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working Hours End</FormLabel>
                        <FormControl>
                          <Input
                            type='time'
                            value={field.value || ''}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Special Flag Dropdown with Other Option */}
              <FormField
                control={form.control}
                name='specialFlags'
                render={({ field }) => {
                  const options = ['urgent', 'priority', 'other'];
                  const value =
                    field.value && field.value[0] ? field.value[0] : '';
                  return (
                    <FormItem>
                      <FormLabel>Special Flag (Optional)</FormLabel>
                      <FormControl>
                        <div>
                          <Select
                            onValueChange={(val) => {
                              if (val === 'other') {
                                field.onChange(['other']);
                              } else {
                                field.onChange([val]);
                              }
                            }}
                            value={value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Select special flag' />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {value === 'other' && (
                            <Input
                              className='mt-2'
                              placeholder='Type your flag'
                              value={field.value?.[1] || ''}
                              onChange={(e) =>
                                field.onChange(['other', e.target.value])
                              }
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            {/* Document Upload Section */}
            <div className='mb-6'>
              <label className='mb-2 block font-medium'>
                Attach Documents (optional)
              </label>
              <p className='py-1 text-sm text-amber-500'>
                Upload your latest monthly statement. Allowed formats: .PDF,
                .CSV. Max file size: 5MB
              </p>
              <FileUploader
                value={files}
                onValueChange={setFiles}
                onUpload={handleFileUpload}
                maxFiles={5}
                maxSize={2 * 1024 * 1024}
                accept={{ 'image/*': [], 'application/pdf': [] }}
                disabled={uploading}
              />

              {/* {documents.length > 0 && (
                <ul className='text-muted-foreground mt-2 text-sm'>
                  {documents.map((doc, idx) => (
                    <li key={idx}>{doc.fileName}</li>
                  ))}
                </ul>
              )} */}

              {documents.length > 0 && (
                <div className='mt-4 rounded-lg border'>
                  <h3 className='text-foreground border-b px-4 py-2 text-sm font-medium'>
                    Uploaded Files
                  </h3>
                  <ul className='divide-y'>
                    {documents.map((doc) => {
                      // Check if the current document's preview is being loaded
                      const isLoading = loadingPreviewKey === doc.fileKey;

                      return (
                        <li
                          key={doc.fileKey}
                          className='flex items-center justify-between p-3'
                        >
                          <div className='flex items-center space-x-3'>
                            <FileIcon className='text-muted-foreground h-5 w-5 flex-shrink-0' />
                            <span
                              className='text-foreground truncate text-sm'
                              title={doc.fileName}
                            >
                              {doc.fileName}
                            </span>
                          </div>

                          {/* This is now a button that triggers our async function */}
                          <button
                            type='button'
                            onClick={() => handlePreview(doc.fileKey)}
                            disabled={isLoading}
                            className={cn(
                              'text-primary ml-4 flex-shrink-0 text-sm font-medium hover:underline focus:outline-none',
                              isLoading && 'cursor-not-allowed' // Style disabled state
                            )}
                          >
                            {isLoading ? (
                              <div className='flex items-center gap-2'>
                                <Spinner size={16} />{' '}
                                {/* Use your Spinner component */}
                                <span>Loading...</span>
                              </div>
                            ) : (
                              'Preview'
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            <Button type='submit' disabled={submitting} className='w-full'>
              {submitting ? 'Submitting...' : 'Submit the Request'}
            </Button>
          </form>
        </Form>
      </div>
    );
  };

  return <PageContainer>{renderAuditForm()}</PageContainer>;
};

export default RequestPage;
