import { useProjectService } from '@/contexts/project-service-context';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useFetchProject(projectId: string) {
  const projectService = useProjectService();

  return useSuspenseQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1_500));

      return projectService.fetchProject(projectId);
    },
  });
}
