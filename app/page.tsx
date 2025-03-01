import { Editor } from '@/components/editor';
import { ProjectServiceProvider } from '@/contexts/project-service-context';
import { TanstackQueryProvider } from '@/contexts/tanstack-query-provider';

export default function HomePage(): ReactComponent {
  return (
    <ProjectServiceProvider>
      <TanstackQueryProvider>
        <main className="w-screen h-screen">
          <Editor />
        </main>
      </TanstackQueryProvider>
    </ProjectServiceProvider>
  );
}
