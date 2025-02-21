import { CanvasAPIProvider } from '@/app/_shared/contexts/canvas-api-context';
import { Editor } from './_components/editor';

export default function Home(): ReactComponent {
  return (
    <main className="w-full h-screen">
      <CanvasAPIProvider>
        <Editor />
      </CanvasAPIProvider>
    </main>
  );
}
