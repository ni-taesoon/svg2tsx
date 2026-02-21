import { Check, Languages } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { SUPPORTED_LOCALES, t, type Locale, type MessageKey } from '@/i18n';

const LOCALE_LABEL_KEYS: Record<Locale, MessageKey> = {
  ko: 'language.korean',
  en: 'language.english',
  ja: 'language.japanese',
  zh: 'language.chinese',
};

export interface LanguageToggleProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ locale, onLocaleChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-semibold">
          <Languages className="mr-1 h-4 w-4" />
          {locale.toUpperCase()}
          <span className="sr-only">{t('language.toggleSrOnly')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LOCALES.map((supportedLocale) => (
          <DropdownMenuItem
            key={supportedLocale}
            onClick={() => onLocaleChange(supportedLocale)}
            className={locale === supportedLocale ? 'bg-accent' : ''}
          >
            <Check
              className={`mr-2 h-4 w-4 ${locale === supportedLocale ? 'opacity-100' : 'opacity-0'}`}
            />
            {t(LOCALE_LABEL_KEYS[supportedLocale])}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
