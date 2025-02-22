import { projectFixture } from './project.fixture';
import { Project } from './project.model';

export interface ProjectService {
  fetchProject(projectId: string): Promise<Project>;
}

export function createProjectService(): ProjectService {
  return {
    fetchProject: async (_projectId: string) => {
      return projectFixture;
    },
  };
}
