import { z } from 'zod';

export const invoiceSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  amount: z.coerce.number().positive('Amount must be positive'),
  status: z.enum(['unpaid', 'paid']).default('unpaid'),
  due_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

export const invoiceUpdateSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive').optional(),
  status: z.enum(['unpaid', 'paid']).optional(),
  due_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }).optional(),
});

export type InvoiceUpdateInput = z.infer<typeof invoiceUpdateSchema>;
