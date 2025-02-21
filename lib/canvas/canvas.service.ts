import { isServer } from '@tanstack/react-query';
import type { Concept } from '../concept';

export interface CanvasEvents {
  onResize?: (width: number, height: number) => void;
}

export interface CanvasService {
  init(canvas: HTMLCanvasElement, events: CanvasEvents): void;
  destroy(): void;

  setDevicePixelRatio(dpr: number): void;
  getCanvasSize(): { width: number; height: number };
  getContext(): CanvasRenderingContext2D;

  clear(): void;
  render(concepts: Concept[]): void;

  drawConcept(
    concept: Concept,
    options?: {
      imageElement?: HTMLImageElement;
    },
  ): void;

  getConceptScreenBounds(concept: Concept): {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export function createCanvasService(): CanvasService {
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let events: CanvasEvents = {};
  let dpr = (() => {
    if (isServer) {
      return 1;
    }

    return window.devicePixelRatio;
  })();
  let resizeObserver: ResizeObserver | null = null;

  function handleResize() {
    if (!canvas) {
      return;
    }

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    events.onResize?.(width, height);
  }

  return {
    init(element: HTMLCanvasElement, canvasEvents: CanvasEvents) {
      canvas = element;
      events = canvasEvents;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Failed to get canvas context');
      }
      ctx = context;

      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(canvas);

      handleResize();
    },

    destroy() {
      resizeObserver?.disconnect();
      resizeObserver = null;
      canvas = null;
      ctx = null;
      events = {};
    },

    setDevicePixelRatio(newDpr: number) {
      dpr = newDpr;
      handleResize();
    },

    getCanvasSize() {
      if (!canvas) {
        throw new Error('Canvas not initialized');
      }

      return {
        width: canvas.width / dpr,
        height: canvas.height / dpr,
      };
    },

    getContext() {
      if (!ctx) {
        throw new Error('Canvas context not initialized');
      }

      return ctx;
    },

    clear() {
      if (!ctx || !canvas) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    render(concepts: Concept[]) {
      this.clear();

      for (const concept of concepts) {
        this.drawConcept(concept);
      }
    },

    drawConcept(
      concept: Concept,
      {
        imageElement,
      }: {
        imageElement?: HTMLImageElement;
      } = {},
    ) {
      if (!ctx || !canvas) {
        return;
      }

      const { width: canvasWidth, height: canvasHeight } = this.getCanvasSize();
      const { scale, position, boundingBox } = concept;

      const width = (boundingBox.xmax - boundingBox.xmin) * scale * canvasWidth;
      const height = (boundingBox.ymax - boundingBox.ymin) * scale * canvasHeight;
      const x = position.x * canvasWidth - width / 2;
      const y = position.y * canvasHeight - height / 2;

      ctx.save();
      ctx.scale(dpr, dpr);

      if (imageElement) {
        ctx.drawImage(imageElement, x, y, width, height);
      }

      ctx.restore();
    },

    getConceptScreenBounds(concept: Concept) {
      if (!canvas) {
        throw new Error('Canvas not initialized');
      }

      const { width: canvasWidth, height: canvasHeight } = this.getCanvasSize();
      const { scale, position, boundingBox } = concept;

      const width = (boundingBox.xmax - boundingBox.xmin) * scale * canvasWidth;
      const height = (boundingBox.ymax - boundingBox.ymin) * scale * canvasHeight;
      const x = position.x * canvasWidth - width / 2;
      const y = position.y * canvasHeight - height / 2;

      return {
        x,
        y,
        width,
        height,
      };
    },
  };
}
