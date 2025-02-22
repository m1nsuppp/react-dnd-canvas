import { Editor } from '@/components/editor';
import { CanvasServiceProvider } from '@/contexts/canvas-service-context';
import { ConceptServiceProvider } from '@/contexts/concept-service-context';
import { ProjectServiceProvider } from '@/contexts/project-service-context';
import { TanstackQueryProvider } from '@/contexts/tanstack-query-provider';

export default function HomePage(): ReactComponent {
  return (
    <CanvasServiceProvider>
      <ConceptServiceProvider>
        <ProjectServiceProvider>
          <TanstackQueryProvider>
            <main className="w-screen h-screen">
              <Editor />
            </main>
          </TanstackQueryProvider>
        </ProjectServiceProvider>
      </ConceptServiceProvider>
    </CanvasServiceProvider>
  );
}
