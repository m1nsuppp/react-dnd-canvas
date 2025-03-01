import * as z from 'zod';

export const dimensionSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export type Dimension = z.infer<typeof dimensionSchema>;
