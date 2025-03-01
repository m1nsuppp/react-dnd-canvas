'use client';

import {
  createProjectService,
  type ProjectService,
} from '@/lib/project/project.service';
import { createContext, type ReactNode, useContext, useState } from 'react';

export const ProjectServiceContext = createContext<ProjectService | undefined>(
  undefined,
);
ProjectServiceContext.displayName = 'ProjectServiceContext';

export function ProjectServiceProvider({ children }: { children: ReactNode }) {
  const [projectService] = useState(() => {
    return createProjectService();
  });

  return (
    <ProjectServiceContext.Provider value={projectService}>
      {children}
    </ProjectServiceContext.Provider>
  );
}

export function useProjectService(): ProjectService {
  const context = useContext(ProjectServiceContext);
  if (context === undefined) {
    throw new Error(
      'useProjectService must be used within a ProjectServiceProvider',
    );
  }

  return context;
}
