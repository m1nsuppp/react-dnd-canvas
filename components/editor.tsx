'use client';

import { nanoid } from 'nanoid';
import { DropzoneArea } from './dropzone-area';
import { Sidebar } from './sidebar';
import dynamic from 'next/dynamic';

const Stage = dynamic(() => import('./stage').then(({ Stage }) => Stage), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-blue-300 rounded animate-pulse" />
  ),
});

const projectId = nanoid();

export function Editor(): ReactComponent {
  return (
    <div className="flex w-full h-full">
      <DropzoneArea>
        <Stage projectId={projectId} />
      </DropzoneArea>
      <Sidebar />
    </div>
  );
}
