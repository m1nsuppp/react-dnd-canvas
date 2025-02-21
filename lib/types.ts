export interface CanvasImage {
  id: string;
  element: HTMLImageElement;
  boundingBox: BoundingBox;
}

export type CanvasSize = {
  width: number;
  height: number;
};

export type ImageSize = {
  width: number;
  height: number;
};

export interface BoundingBox {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

export type ObjectFit = 'contain' | 'cover';
