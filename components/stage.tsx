'use client';

import { useRef, useEffect, useState } from 'react';
import { StageWrapper } from './stage-wrapper';
import { useFetchProject } from '@/hooks/use-fetch-project';
import { useSuspenseQueries } from '@tanstack/react-query';
import { loadImage } from '@/lib/utils';
import { useCanvasService } from '@/contexts/canvas-service-context';
import { useConceptService } from '@/contexts/concept-service-context';
import type { Concept } from '@/lib/concept';

interface StageProps {
  projectId: string;
}

export function Stage({ projectId }: StageProps): ReactComponent {
  const { data: project } = useFetchProject(projectId);
  const [concepts, setConcepts] = useState<Concept[]>(project.concepts);

  const conceptWithImageQueries = useSuspenseQueries({
    queries: concepts.map((concept) => ({
      queryKey: ['concept', concept.id],
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1_500));

        const imageElement = await loadImage(concept.image.url);

        return imageElement;
      },
    })),
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasService = useCanvasService();
  const conceptService = useConceptService();
  const imageElements = Object.fromEntries(
    conceptWithImageQueries.map((query, index) => [
      concepts[index].id,
      query.data,
    ]),
  );

  useEffect(() => {
    conceptService.updateConcepts(concepts);
  }, [conceptService, concepts]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    canvasService.init(canvasRef.current, {});
    conceptService.init({
      onMove: (concept) => {
        setConcepts((prev) =>
          prev.map((c) => (c.id === concept.id ? concept : c)),
        );

        const renderableConcepts = concepts.map((c) => ({
          ...c,
          imageElement: imageElements[c.id],
        }));
        renderableConcepts[
          renderableConcepts.findIndex((c) => c.id === concept.id)
        ] = {
          ...concept,
          imageElement: imageElements[concept.id],
        };

        canvasService.render(renderableConcepts);
      },
      onScale: (concept) => {
        setConcepts((prev) =>
          prev.map((c) => (c.id === concept.id ? concept : c)),
        );

        const renderableConcepts = concepts.map((c) => ({
          ...c,
          imageElement: imageElements[c.id],
        }));
        renderableConcepts[
          renderableConcepts.findIndex((c) => c.id === concept.id)
        ] = {
          ...concept,
          imageElement: imageElements[concept.id],
        };

        canvasService.render(renderableConcepts);
      },
    });

    const renderableConcepts = concepts.map((concept) => ({
      ...concept,
      imageElement: imageElements[concept.id],
    }));
    canvasService.render(renderableConcepts);

    return () => {
      canvasService.destroy();
    };
  }, [canvasService, conceptService, concepts, imageElements]);

  return (
    <StageWrapper
      onResize={(width, height) => {
        if (!canvasRef.current) {
          return;
        }

        canvasRef.current.width = width;
        canvasRef.current.height = height;
        canvasService.init(canvasRef.current, {});

        const renderableConcepts = concepts.map((concept) => ({
          ...concept,
          imageElement: imageElements[concept.id],
        }));
        canvasService.render(renderableConcepts);
      }}
    >
      <canvas
        className="w-full h-full"
        ref={canvasRef}
        onPointerDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          conceptService.handlePointerDown(
            e.clientX - rect.left,
            e.clientY - rect.top,
            canvasService.getCanvasSize(),
          );
        }}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          conceptService.handlePointerMove(
            e.clientX - rect.left,
            e.clientY - rect.top,
            canvasService.getCanvasSize(),
          );
        }}
        onPointerUp={() => {
          conceptService.handlePointerUp();
        }}
        onWheel={(e) => {
          e.preventDefault();
          conceptService.handleWheel(e.deltaY);
        }}
      />
    </StageWrapper>
  );
}
