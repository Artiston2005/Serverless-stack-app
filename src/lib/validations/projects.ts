import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  status: z.enum(['pending', 'active', 'completed']).default('pending'),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const projectUpdateSchema = projectSchema.partial();

export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
