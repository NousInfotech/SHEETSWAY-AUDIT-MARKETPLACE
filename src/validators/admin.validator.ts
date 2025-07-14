import { z } from 'zod';

export const adminSchema = z.object({
  firebaseId: z.string().min(1, "Firebase ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
});

export const updateAdminSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
});

export const adminIdParamsSchema = z.object({
  adminId: z.string().uuid("Invalid admin ID format"),
});

export const adminFiltersSchema = z.object({
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).optional(),
  page: z.number().min(1).optional(),
});

export const adminSearchSchema = z.object({
  searchTerm: z.string().min(1, "Search term is required"),
});

export const adminDateRangeSchema = z.object({
  startDate: z.string().datetime("Invalid start date format"),
  endDate: z.string().datetime("Invalid end date format"),
}); 