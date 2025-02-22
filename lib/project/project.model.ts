import * as z from 'zod';
import { conceptSchema } from '../concept';

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  concepts: conceptSchema.array(),
});

export type Project = z.infer<typeof projectSchema>;
