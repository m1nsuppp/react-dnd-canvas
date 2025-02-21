import type { CanvasSize } from '../canvas';
import type { Concept } from './concept.model';

export interface ConceptEvents {
  onMove?: (concept: Concept) => void;
  onScale?: (concept: Concept) => void;
  onRotate?: (concept: Concept) => void;
  onSelect?: (concept: Concept | null) => void;
  onHover?: (concept: Concept | null) => void;
  onRemove?: (concept: Concept) => void;
  onDragStart?: (concept: Concept) => void;
  onDragEnd?: (concept: Concept) => void;
}

export interface ConceptService {
  init(events: ConceptEvents): void;
  updateConcepts(concepts: Concept[]): void;
  getSelectedConceptId(): string | null;
  getHoveredConceptId(): string | null;

  handlePointerDown(x: number, y: number, canvasSize: CanvasSize): void;
  handlePointerMove(x: number, y: number, canvasSize: CanvasSize): void;
  handlePointerUp(): void;
  handleWheel(delta: number): void;

  getConceptAtPoint(x: number, y: number, canvasSize: CanvasSize): Concept | null;
  getConceptBounds(
    concept: Concept,
    canvasSize: CanvasSize,
  ): {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export function createConceptService(): ConceptService {
  let concepts: Concept[] = [];
  let events: ConceptEvents = {};
  let selectedConceptId: string | null = null;
  let hoveredConceptId: string | null = null;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  function getConceptBounds(concept: Concept, canvasSize: CanvasSize) {
    const { width: canvasWidth, height: canvasHeight } = canvasSize;
    const { scale, position, boundingBox } = concept;

    const width = (boundingBox.xmax - boundingBox.xmin) * scale * canvasWidth;
    const height = (boundingBox.ymax - boundingBox.ymin) * scale * canvasHeight;

    return {
      x: position.x * canvasWidth - width / 2,
      y: position.y * canvasHeight - height / 2,
      width,
      height,
    };
  }

  function getConceptAtPoint(x: number, y: number, canvasSize: CanvasSize) {
    for (const concept of [...concepts].reverse()) {
      const bounds = getConceptBounds(concept, canvasSize);
      if (
        x >= bounds.x &&
        x <= bounds.x + bounds.width &&
        y >= bounds.y &&
        y <= bounds.y + bounds.height
      ) {
        return concept;
      }
    }
    return null;
  }

  return {
    init(newEvents: ConceptEvents) {
      events = newEvents;
    },

    updateConcepts(newConcepts: Concept[]) {
      concepts = newConcepts;
    },

    getSelectedConceptId() {
      return selectedConceptId;
    },

    getHoveredConceptId() {
      return hoveredConceptId;
    },

    handlePointerDown(x: number, y: number, canvasSize: CanvasSize) {
      const hitConcept = getConceptAtPoint(x, y, canvasSize);

      if (hitConcept) {
        isDragging = true;
        dragStartX = x;
        dragStartY = y;
        selectedConceptId = hitConcept.id;
        events.onSelect?.(hitConcept);
        events.onDragStart?.(hitConcept);
      } else {
        selectedConceptId = null;
        events.onSelect?.(null);
      }
    },

    handlePointerMove(x: number, y: number, canvasSize: CanvasSize) {
      if (isDragging && selectedConceptId) {
        const concept = concepts.find((c) => c.id === selectedConceptId);
        if (concept) {
          const dx = (x - dragStartX) / canvasSize.width;
          const dy = (y - dragStartY) / canvasSize.height;

          const updatedConcept = {
            ...concept,
            position: {
              x: concept.position.x + dx,
              y: concept.position.y + dy,
            },
          };

          events.onMove?.(updatedConcept);
          dragStartX = x;
          dragStartY = y;
        }
      } else {
        const hitConcept = getConceptAtPoint(x, y, canvasSize);
        if (hitConcept?.id !== hoveredConceptId) {
          hoveredConceptId = hitConcept?.id ?? null;
          events.onHover?.(hitConcept ?? null);
        }
      }
    },

    handlePointerUp() {
      if (isDragging && selectedConceptId) {
        const concept = concepts.find((c) => c.id === selectedConceptId);
        if (concept) {
          events.onDragEnd?.(concept);
        }
      }
      isDragging = false;
    },

    handleWheel(delta: number) {
      if (selectedConceptId) {
        const concept = concepts.find((c) => c.id === selectedConceptId);
        if (concept) {
          const scaleFactor = delta > 0 ? 0.9 : 1.1;
          const updatedConcept = {
            ...concept,
            scale: concept.scale * scaleFactor,
          };
          events.onScale?.(updatedConcept);
        }
      }
    },

    getConceptAtPoint,
    getConceptBounds,
  };
}
