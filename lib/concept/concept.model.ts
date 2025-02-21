import * as z from 'zod';

export const conceptSchema = z.object({
  id: z.string(),
  image: z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  boundingBox: z.object({
    xmax: z.number(),
    ymax: z.number(),
    xmin: z.number(),
    ymin: z.number(),
  }),
  scale: z.number(),
  rotation: z.number(),
});

export type Concept = z.infer<typeof conceptSchema>;
