import { Canvas } from './canvas';
import { Sidebar } from './sidebar';

export function Editor(): React.JSX.Element {
  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full">
        <Canvas />
      </div>
      <Sidebar />
    </div>
  );
}
