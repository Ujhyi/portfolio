'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiError, DEMO_EMAIL, DEMO_PASSWORD } from '../_lib/api-client';
import { useAuth } from '../_lib/auth-context';
import { useLanguage } from '../_lib/i18n';
import { BASE } from '../_lib/routes';

export default function LoginPage() {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setToken } = useAuth();
  const { t } = useLanguage();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await api.login(email, password);
      setToken(token);
      router.push(`${BASE}/dashboard`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('loginErrorGeneric'));
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-[calc(100vh-44px)] flex items-center justify-center px-10 sm:px-4 py-6 sm:py-8">
      <div className="max-w-sm w-full sp-card p-4 sm:p-8">
        <h1 className="sp-display text-lg sm:text-2xl font-bold tracking-tight mb-3 sm:mb-6">{t('loginTitle')}</h1>


        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:gap-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-[var(--muted)] mb-1">{t('emailLabel')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-[13px] sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-[var(--muted)] mb-1">{t('passwordLabel')}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-[13px] sm:text-sm"
            />
          </div>

          {error && <p className="text-xs sm:text-sm text-[var(--danger)] bg-[var(--danger-soft)] px-3 py-2 sm:px-4 sm:py-2.5 rounded-[var(--radius-xl2)]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3.5 rounded-[var(--radius-xl2)] text-[13px] sm:text-sm font-semibold transition-opacity disabled:opacity-50 hover:opacity-90"
            style={{ background: 'var(--accent)', color: '#FFFFFF' }}
          >
            {loading ? t('loginSubmitting') : t('loginSubmit')}
          </button>
        </form>

        <p className="text-[11px] sm:text-xs text-[var(--muted)] mt-3 sm:mt-6 text-center">
          {t('demoLoginHint')}
        </p>
        <p className="text-[11px] sm:text-xs text-center mt-2">
          <Link href={BASE} className="text-[var(--accent)] font-semibold">
            ←
          </Link>
        </p>
      </div>
    </main>
  );
}