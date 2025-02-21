'use client';

import { useEffect, useRef, useState } from 'react';
import Dropzone from 'react-dropzone';
import { nanoid } from 'nanoid';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { createImageElement } from '@/lib/utils';
import { CanvasImage } from '@/lib/types';
import { useCanvasAPI } from '@/app/_shared/contexts/canvas-api-context';

export function Canvas(): ReactComponent {
  const grandParentRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<CanvasImage[]>([]);
  const { mutate: createImageElement, isPending: isCreateImageElementPending } =
    useCreateImageElement();
  const canvasAPI = useCanvasAPI();

  useEffect(() => {
    const grandParentElement = grandParentRef.current;
    const parentElement = parentRef.current;
    const canvasElement = canvasRef.current;
    if (!grandParentElement || !parentElement || !canvasElement) {
      return;
    }

    const context = canvasElement.getContext('2d');
    if (!context) {
      return;
    }

    const grandParentElementResizeObserver = new ResizeObserver(
      (grandParentElementResizeObserverEntries) => {
        for (const grandParentElementResizeObserverEntry of grandParentElementResizeObserverEntries) {
          const {
            contentRect: { width: grandParentElementWidth, height: grandParentElementHeight },
          } = grandParentElementResizeObserverEntry;
          const minDimension = Math.min(grandParentElementWidth, grandParentElementHeight);
          const { width: clampedWidth, height: clampedHeight } = canvasAPI.clampCanvasSize({
            width: minDimension,
            height: minDimension,
          });
          parentElement.style.maxWidth = `${clampedWidth}px`;
          parentElement.style.maxHeight = `${clampedHeight}px`;

          const dpr = window.devicePixelRatio;
          canvasElement.width = clampedWidth * dpr;
          canvasElement.height = clampedHeight * dpr;

          context.clearRect(0, 0, canvasElement.width, canvasElement.height);
          canvasAPI.drawImages(context, images);
        }
      },
    );

    grandParentElementResizeObserver.observe(grandParentElement);

    return () => {
      grandParentElementResizeObserver.unobserve(grandParentElement);
    };
  }, [images]);

  return (
    <Dropzone
      accept={{
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png'],
        'image/webp': ['.webp'],
      }}
      multiple={false}
      noClick
      noKeyboard
      onDrop={(acceptedFiles) => {
        const file = acceptedFiles[0];

        const uploadedImageBlobURL = URL.createObjectURL(file);

        createImageElement(uploadedImageBlobURL, {
          onSuccess: (createdImageElement) => {
            const boundingBox = canvasAPI.getBoundingBox({
              canvas: {
                width: canvasRef.current?.width || 0,
                height: canvasRef.current?.height || 0,
              },
              image: {
                width: createdImageElement.width,
                height: createdImageElement.height,
              },
            });

            setImages((prev) => [
              ...prev,
              {
                id: nanoid(),
                element: createdImageElement,
                boundingBox,
              },
            ]);
          },
        });
      }}
    >
      {({ getRootProps, getInputProps }) => {
        return (
          <div
            {...getRootProps()}
            ref={grandParentRef}
            className="p-10 relative w-full h-full flex justify-center items-center"
          >
            <div
              ref={parentRef}
              className="w-full h-full relative"
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full outline outline-1 outline-gray-300"
              />
              {isCreateImageElementPending ? (
                <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
                  <p>Loading...</p>
                </div>
              ) : null}
            </div>

            <input
              {...getInputProps()}
              type="file"
            />
          </div>
        );
      }}
    </Dropzone>
  );
}

function useCreateImageElement(): UseMutationResult<HTMLImageElement, Error, string, unknown> {
  return useMutation({
    mutationFn: (src: string) => {
      return createImageElement(src);
    },
  });
}
