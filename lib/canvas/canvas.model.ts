import * as z from 'zod';

export const canvasSizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export type CanvasSize = z.infer<typeof canvasSizeSchema>;
