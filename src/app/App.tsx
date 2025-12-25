import { getCurrentWindow } from '@tauri-apps/api/window';

import { ThemeProvider, useTheme } from './providers';
import './styles/globals.css';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed right-3 top-2 z-[9999] flex gap-1">
      {(['system', 'light', 'dark'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`rounded-md px-3 py-1.5 text-xs capitalize transition-opacity ${
            theme === t
              ? 'border border-primary opacity-100'
              : 'border border-transparent opacity-70 hover:opacity-100'
          } bg-secondary text-secondary-foreground`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function DragRegion() {
  const handleDragStart = () => {
    getCurrentWindow().startDragging();
  };

  const handleDoubleClick = () => {
    getCurrentWindow().toggleMaximize();
  };

  return (
    <div className="drag-region" onMouseDown={handleDragStart} onDoubleClick={handleDoubleClick} />
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <DragRegion />
      <ThemeToggle />
      <main className="flex h-screen w-screen items-center justify-center pt-[52px]">
        <h1 className="text-4xl font-bold">SVG2TSX</h1>
      </main>
    </ThemeProvider>
  );
}

export default App;
