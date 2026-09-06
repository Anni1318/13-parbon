'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/lib/i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';

export type Language = 'en' | 'bn' | 'hi';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const { t } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem('puja-guide-lang') as Language | null;
    if (saved && ['en', 'bn', 'hi'].includes(saved)) {
      setLanguageState(saved);
      i18n.changeLanguage(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('puja-guide-lang', lang);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider value={{ language, setLanguage, t }}>
        {children}
      </LanguageContext.Provider>
    </I18nextProvider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
