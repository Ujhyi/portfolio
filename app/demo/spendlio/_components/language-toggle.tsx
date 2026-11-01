'use client';

import { useLanguage } from '../_lib/i18n';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'sk' ? 'en' : 'sk')}
      className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors uppercase"
    >
      {lang === 'sk' ? 'EN' : 'SK'}
    </button>
  );
}