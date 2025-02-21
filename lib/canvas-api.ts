import type { ImageSize, CanvasSize, BoundingBox, CanvasImage, ObjectFit } from './types';
import { MAX_CANVAS_SIZE } from './constants';
import { clamp } from './utils';

export interface CanvasAPI {
  clampCanvasSize(input: CanvasSize, max?: CanvasSize): CanvasSize;
  getScaledImageSize({
    canvas,
    image,
  }: {
    canvas: CanvasSize;
    image: ImageSize;
  }): ImageSize & { scaleFactor: number };
  getBoundingBox({ canvas, image }: { canvas: CanvasSize; image: ImageSize }): BoundingBox;
  drawImageContained(ctx: CanvasRenderingContext2D, image: HTMLImageElement): void;
  drawImages(
    ctx: CanvasRenderingContext2D,
    images: CanvasImage[],
    type?: ObjectFit,
    index?: number,
  ): void;
}

export function createCanvasAPI(): CanvasAPI {
  return {
    clampCanvasSize,
    getScaledImageSize,
    getBoundingBox,
    drawImageContained,
    drawImages,
  };
}

function clampCanvasSize(input: CanvasSize, max: CanvasSize = MAX_CANVAS_SIZE): CanvasSize {
  return {
    width: clamp(input.width, 0, max.width),
    height: clamp(input.height, 0, max.height),
  };
}

function getScaledImageSize({
  canvas,
  image,
}: {
  canvas: CanvasSize;
  image: ImageSize;
}): ImageSize & { scaleFactor: number } {
  const widthRatio = canvas.width / image.width;
  const heightRatio = canvas.height / image.height;

  const scaleFactor = Math.min(widthRatio, heightRatio, 1);

  return {
    width: image.width * scaleFactor,
    height: image.height * scaleFactor,
    scaleFactor,
  };
}

function getBoundingBox({
  canvas,
  image,
}: {
  canvas: { width: number; height: number };
  image: { width: number; height: number };
}): BoundingBox {
  const physicalCanvasWidth = canvas.width;
  const physicalCanvasHeight = canvas.height;

  const dpr = window.devicePixelRatio;
  const logicalCanvasWidth = physicalCanvasWidth / dpr;
  const logicalCanvasHeight = physicalCanvasHeight / dpr;

  const { width: scaledLogicalImageWidth, height: scaledLogicalImageHeight } = getScaledImageSize({
    canvas: { width: logicalCanvasWidth, height: logicalCanvasHeight },
    image: { width: image.width, height: image.height },
  });

  const scaledPhysicalImageWidth = scaledLogicalImageWidth * dpr;
  const scaledPhysicalImageHeight = scaledLogicalImageHeight * dpr;

  const centerX = (physicalCanvasWidth - scaledPhysicalImageWidth) / 2;
  const centerY = (physicalCanvasHeight - scaledPhysicalImageHeight) / 2;

  return {
    xmin: centerX / physicalCanvasWidth,
    ymin: centerY / physicalCanvasHeight,
    xmax: (centerX + scaledPhysicalImageWidth) / physicalCanvasWidth,
    ymax: (centerY + scaledPhysicalImageHeight) / physicalCanvasHeight,
  };
}

function drawImageContained(ctx: CanvasRenderingContext2D, image: HTMLImageElement): void {
  const physicalCanvasWidth = ctx.canvas.width;
  const physicalCanvasHeight = ctx.canvas.height;

  const dpr = window.devicePixelRatio;
  const logicalCanvasWidth = physicalCanvasWidth / dpr;
  const logicalCanvasHeight = physicalCanvasHeight / dpr;

  const { width: scaledLogicalImageWidth, height: scaledLogicalImageHeight } = getScaledImageSize({
    canvas: { width: logicalCanvasWidth, height: logicalCanvasHeight },
    image: { width: image.width, height: image.height },
  });

  const scaledPhysicalImageWidth = scaledLogicalImageWidth * dpr;
  const scaledPhysicalImageHeight = scaledLogicalImageHeight * dpr;

  const x = (physicalCanvasWidth - scaledPhysicalImageWidth) / 2;
  const y = (physicalCanvasHeight - scaledPhysicalImageHeight) / 2;

  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    x,
    y,
    scaledPhysicalImageWidth,
    scaledPhysicalImageHeight,
  );
}

function drawImages(
  context: CanvasRenderingContext2D,
  images: CanvasImage[],
  type: ObjectFit = 'contain',
  index: number = 0,
): void {
  if (type === 'cover') {
    throw new Error('Not implemented');
  }

  if (index >= images.length) {
    return;
  }

  drawImageContained(context, images[index].element);
  drawImages(context, images, type, index + 1);
}
