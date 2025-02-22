import * as z from 'zod';
import { type Concept } from '../concept';

export const canvasSizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export interface RenderableConcept extends Concept {
  imageElement: HTMLImageElement;
}

export type CanvasSize = z.infer<typeof canvasSizeSchema>;
