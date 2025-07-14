'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessProfileSchema} from '@/validators/user.validator'
import { CountryEnum,FirmSizeEnum } from '../utils/zod-schemas';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from "sonner";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { updateBusinessProfile } from '@/api/user.api';

export type BusinessProfileFormValues = z.infer<typeof businessProfileSchema>;

export default function BusinessProfileForm({ open, onOpenChange, onSubmit, initialValues, isEdit }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BusinessProfileFormValues) => void;
  initialValues?: BusinessProfileFormValues | null;
  isEdit?: boolean;
}) {
  const form = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: initialValues || {
      name: '',
      vatId: '',
      country: undefined,
      category: '',
      size: undefined,
      annualTurnover: undefined,
      transactionsPerYear: undefined
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset(initialValues || {
        name: '',
        vatId: '',
        country: undefined,
        category: '',
        size: undefined,
        annualTurnover: undefined,
        transactionsPerYear: undefined,
      });
    }
  }, [open, initialValues]);

  function handleSubmit(values: BusinessProfileFormValues) {
    onSubmit({
      ...values
    });
    toast.success(isEdit ? "Business profile updated successfully!" : "Business profile created successfully!");
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Business Profile' : 'Create Business Profile'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="vatId" render={({ field }) => (
              <FormItem>
                <FormLabel>VAT ID</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="country" render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select value={field.value ?? ''} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {CountryEnum.options.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="size" render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Select value={field.value ?? ''} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {FirmSizeEnum.options.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="annualTurnover" render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Turnover</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="transactionsPerYear" render={({ field }) => (
              <FormItem>
                <FormLabel>Transactions Per Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="submit">{isEdit ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
        {/* Debug output for validation errors */}
        <div style={{ color: 'red', marginTop: 16, fontSize: 12 }}>
          {Object.keys(form.formState.errors).length > 0 && (
            <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 