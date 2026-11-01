'use client';

import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { resetDemoData } from '../_lib/api-client';
import { useLanguage } from '../_lib/i18n';

// Thin strip above the app: way back to the portfolio, what this is, and a reset button.
export function DemoBar() {
  const { t } = useLanguage();

  return (
    <div className="h-11 border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="max-w-5xl mx-auto h-full px-4 flex items-center justify-between gap-3 text-xs">
        <Link
          href="/"
          className="font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-colors whitespace-nowrap"
        >
          {t('backToPortfolio')}
        </Link>
        <p className="hidden sm:block text-[var(--muted)] truncate">{t('demoBanner')}</p>
        <button
          onClick={() => {
            resetDemoData();
            window.location.reload();
          }}
          className="inline-flex items-center gap-1.5 font-semibold text-[var(--muted)] hover:text-[var(--ink)] px-2.5 py-1.5 rounded-full hover:bg-[var(--surface-2)] transition-colors whitespace-nowrap"
        >
          <RotateCcw size={12} />
          {t('demoReset')}
        </button>
      </div>
    </div>
  );
}
