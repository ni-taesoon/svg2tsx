import { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';

import { MainPage } from '@/pages/main';
import { ThemeProvider } from './providers';
import { ThemeToggle } from '@/features/theme-toggle';
import { LanguageToggle } from '@/features/language-toggle';
import { Toaster, SnowEffect } from '@/shared/ui';
import { UpdateBanner } from '@/widgets/update-banner';
import { getCurrentLocale, setCurrentLocale, type Locale } from '@/i18n';
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
  const [locale, setLocale] = useState<Locale>(() => getCurrentLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(setCurrentLocale(nextLocale));
  };

  return (
    <ThemeProvider defaultTheme="system">
      <DragRegion />
      <SnowEffect />
      <div className="fixed right-3 top-2 z-[9999] flex items-center gap-1">
        <LanguageToggle locale={locale} onLocaleChange={handleLocaleChange} />
        <ThemeToggle />
      </div>
      <MainPage className="pt-[52px]" />
      <Toaster position="bottom-right" richColors closeButton />
      <UpdateBanner />
    </ThemeProvider>
  );
}

export default App;
