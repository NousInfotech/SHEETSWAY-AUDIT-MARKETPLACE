import { z } from 'zod';
import { RequestType, AuditFramework, UrgencyLevel } from '@/types/api-types/enums'

export const clientRequestSchema = z.object({
  businessId: z.string().uuid("Invalid business ID format"),
  type: z.nativeEnum(RequestType, {
    errorMap: () => ({ message: "Invalid request type" })
  }),
  framework: z.nativeEnum(AuditFramework, {
    errorMap: () => ({ message: "Invalid audit framework" })
  }),
  financialYear: z.string().min(1, "Financial year is required"),
  auditStart: z.string().datetime().optional(),
  auditEnd: z.string().datetime().optional(),
  deadline: z.string().datetime("Invalid deadline format"),
  notes: z.string().min(1, "Notes are required"),
  urgency: z.nativeEnum(UrgencyLevel, {
    errorMap: () => ({ message: "Invalid urgency level" })
  }),
  budget: z.number().min(0, "Budget must be 0 or greater").optional(),
  isAnonymous: z.boolean().default(false),
  isActive: z.boolean().default(true),
  preferredLanguages: z.array(z.string()).min(1, "At least one preferred language is required"),
  timeZone: z.string().optional(),
  workingHours: z.string().optional(),
  specialFlags: z.array(z.string()).optional(),
});

export const updateClientRequestSchema = z.object({
  type: z.nativeEnum(RequestType, {
    errorMap: () => ({ message: "Invalid request type" })
  }).optional(),
  framework: z.nativeEnum(AuditFramework, {
    errorMap: () => ({ message: "Invalid audit framework" })
  }).optional(),
  financialYear: z.string().min(1, "Financial year is required").optional(),
  auditStart: z.string().datetime().optional(),
  auditEnd: z.string().datetime().optional(),
  deadline: z.string().datetime("Invalid deadline format").optional(),
  notes: z.string().min(1, "Notes are required").optional(),
  urgency: z.nativeEnum(UrgencyLevel, {
    errorMap: () => ({ message: "Invalid urgency level" })
  }).optional(),
  budget: z.number().min(0, "Budget must be 0 or greater").optional(),
  isAnonymous: z.boolean().optional(),
  isActive: z.boolean().optional(),
  preferredLanguages: z.array(z.string()).min(1, "At least one preferred language is required").optional(),
  timeZone: z.string().optional(),
  workingHours: z.string().optional(),
  specialFlags: z.array(z.string()).optional(),
});

export const clientRequestIdParamsSchema = z.object({
  requestId: z.string().uuid("Invalid request ID format"),
});

export const clientRequestFiltersSchema = z.object({
  type: z.nativeEnum(RequestType).optional(),
  framework: z.nativeEnum(AuditFramework).optional(),
  urgency: z.nativeEnum(UrgencyLevel).optional(),
  isActive: z.boolean().optional(),
  isAnonymous: z.boolean().optional(),
  minBudget: z.number().min(0).optional(),
  maxBudget: z.number().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  language: z.string().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  page: z.number().min(1).optional(),
});

export const clientRequestSearchSchema = z.object({
  searchTerm: z.string().min(1, "Search term is required"),
});

export const clientRequestBudgetRangeSchema = z.object({
  minBudget: z.number().min(0, "Minimum budget must be 0 or greater"),
  maxBudget: z.number().min(0, "Maximum budget must be 0 or greater"),
});

export const clientRequestDateRangeSchema = z.object({
  startDate: z.string().datetime("Invalid start date format"),
  endDate: z.string().datetime("Invalid end date format"),
});

// ===================== ClientRequestDocument Schemas =====================

export const clientRequestDocumentSchema = z.object({
  requestId: z.string().uuid("Invalid request ID format"),
  fileName: z.string().min(1, "File name is required"),
  fileUrl: z.string().url("Invalid file URL"),
});

export const updateClientRequestDocumentSchema = z.object({
  fileName: z.string().min(1, "File name is required").optional(),
  fileUrl: z.string().url("Invalid file URL").optional(),
});

export const clientRequestDocumentIdParamsSchema = z.object({
  documentId: z.string().uuid("Invalid document ID format"),
}); 