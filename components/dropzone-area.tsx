'use client';

import { type ReactNode } from 'react';
import Dropzone, {
  type DropzoneProps as ReactDropzoneProps,
} from 'react-dropzone';

interface DropzoneAreaProps
  extends Omit<
    ReactDropzoneProps,
    'children' | 'noDragEventsBubbling' | 'noClick' | 'onDrop'
  > {
  children: ReactNode;
}

export function DropzoneArea({
  children,
  ...props
}: DropzoneAreaProps): ReactComponent {
  return (
    <Dropzone
      noDragEventsBubbling
      noClick
      onDrop={(files) => {
        console.log(files);
      }}
      {...props}
    >
      {({ getInputProps, getRootProps, isDragActive }) => {
        return (
          <div
            {...getRootProps()}
            className="w-full h-full relative"
          >
            {isDragActive ? (
              <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-50" />
            ) : null}
            <input {...getInputProps()} />
            {children}
          </div>
        );
      }}
    </Dropzone>
  );
}
