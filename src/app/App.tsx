import { getCurrentWindow } from '@tauri-apps/api/window';

import { MainPage } from '@/pages/main';
import { ThemeProvider } from './providers';
import { ThemeToggle } from '@/features/theme-toggle';
import { Toaster, SnowEffect } from '@/shared/ui';
import './styles/globals.css';

function DragRegion() {
  const handleDragStart = () => {
    getCurrentWindow().startDragging();
  };

  const handleDoubleClick = () => {
    getCurrentWindow().toggleMaximize();
  };

  return (
    <div
      className="drag-region cursor-default"
      onMouseDown={handleDragStart}
      onDoubleClick={handleDoubleClick}
    />
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <DragRegion />
      <SnowEffect />
      <div className="fixed right-3 top-2 z-[9999]">
        <ThemeToggle />
      </div>
      <MainPage className="pt-[52px]" />
      <Toaster position="bottom-right" richColors closeButton />
    </ThemeProvider>
  );
}

export default App;
