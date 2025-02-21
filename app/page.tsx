import { CanvasServiceProvider } from '@/contexts/canvas-service-context';
import { ConceptServiceProvider } from '@/contexts/concept-service-context';
import { TanstackQueryProvider } from '@/contexts/tanstack-query-provider';

export default function HomePage(): ReactComponent {
  return (
    <CanvasServiceProvider>
      <ConceptServiceProvider>
        <TanstackQueryProvider>
          <main className="w-screen h-full"></main>
        </TanstackQueryProvider>
      </ConceptServiceProvider>
    </CanvasServiceProvider>
  );
}
