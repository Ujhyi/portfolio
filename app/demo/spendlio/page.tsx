'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from './_lib/auth-context';
import { useLanguage } from './_lib/i18n';
import { ThemeToggle } from './_components/theme-toggle';
import { LanguageToggle } from './_components/language-toggle';
import { BASE } from './_lib/routes';

export default function HomePage() {
  const { token, isLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && token) {
      router.replace(`${BASE}/dashboard`);
    }
  }, [isLoading, token, router]);

  if (isLoading) return null;

  return (
    <main className="min-h-[calc(100vh-44px)] flex items-center justify-center px-4 relative">
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full sp-card p-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold mb-6">
          <Sparkles size={12} />
          AI-powered
        </div>

        <h1 className="sp-display text-4xl font-bold tracking-tight mb-2 leading-[1.1]">
          {t('heroLine1')}<br />{t('heroLine2')}
        </h1>

        <p className="text-sm text-[var(--muted)] leading-relaxed mt-4 mb-8">{t('heroDescription')}</p>

        <div className="flex flex-col gap-3">
          <Link
            href={`${BASE}/login`}
            className="group w-full py-3.5 px-5 bg-[var(--accent)] text-white rounded-[var(--radius-xl2)] text-sm font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            {t('tryDemoBtn')}
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href={`${BASE}/login`}
            className="w-full py-3.5 px-5 border border-[var(--line)] rounded-[var(--radius-xl2)] text-sm font-semibold text-center hover:bg-[var(--surface-2)] transition-colors"
          >
            {t('loginBtn')}
          </Link>
        </div>
      </div>
    </main>
  );
}