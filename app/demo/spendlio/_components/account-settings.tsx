'use client';

import { useState, FormEvent, useEffect } from 'react';
import { ChevronDown, TriangleAlert, Coins } from 'lucide-react';
import { api, ApiError } from '../_lib/api-client';
import { useAuth } from '../_lib/auth-context';
import { useLanguage } from '../_lib/i18n';
import { BASE } from '../_lib/routes';

const CURRENCIES = ['EUR', 'CZK', 'USD', 'GBP', 'PLN'];

export function AccountSettings({ token }: { token: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmingDisable, setConfirmingDisable] = useState(false);
  const [disabledMessage, setDisabledMessage] = useState<string | null>(null);
  const { setToken } = useAuth();

  const [baseCurrency, setBaseCurrency] = useState('EUR');
  const [savingCurrency, setSavingCurrency] = useState(false);

  useEffect(() => {
    api.getSettings(token).then((s) => setBaseCurrency(s.baseCurrency)).catch(() => {});
  }, [token]);

  async function handleCurrencyChange(newCurrency: string) {
    setBaseCurrency(newCurrency);
    setSavingCurrency(true);
    try {
      await api.updateSettings(token, newCurrency);
    } catch {
      // ignore
    } finally {
      setSavingCurrency(false);
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await api.changePassword(token, oldPassword, newPassword);
      setInfo(t('passwordChangedSuccess'));
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('changePasswordErrorGeneric'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDisableAccount() {
    setError(null);
    setLoading(true);
    try {
      const result = await api.disableAccount(token);
      setDisabledMessage(result.message);
      setTimeout(() => {
        setToken(null);
        window.location.href = BASE;
      }, 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('disableErrorGeneric'));
      setLoading(false);
      setConfirmingDisable(false);
    }
  }

  if (disabledMessage) {
    return (
      <div className="sp-card p-6 text-center">
        <p className="text-sm">{disabledMessage}</p>
        <p className="text-xs text-[var(--muted)] mt-2">{t('loggingOutText')}</p>
      </div>
    );
  }

  return (
    <div className="sp-card p-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs font-semibold text-[var(--muted)] underline hover:text-[var(--ink)] transition-colors"
      >
        {t('accountSettingsTitle')}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-[var(--muted)] font-medium flex items-center gap-1.5">
              <Coins size={13} />
              {t('currencyLabel')}
            </p>
            <select
              value={baseCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              disabled={savingCurrency}
              className="px-3 py-2.5 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-sm disabled:opacity-50"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <p className="text-[11px] text-[var(--muted)]">
              {t('currencyHint')}
            </p>
          </div>

          <div className="border-t border-[var(--line)]" />

          <form onSubmit={handleChangePassword} className="flex flex-col gap-2">
            <p className="text-xs text-[var(--muted)] font-medium">{t('changePasswordLabel')}</p>
            <input
              type="password" required placeholder={t('oldPasswordPlaceholder')} value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="px-3 py-2.5 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-sm"
            />
            <input
              type="password" required minLength={8} placeholder={t('newPasswordPlaceholder')} value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-3 py-2.5 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-sm"
            />
            <button type="submit" disabled={loading}
              className="py-2.5 border border-[var(--line)] rounded-[var(--radius-xl2)] text-xs font-semibold hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50">
              {loading ? t('changingPasswordBtn') : t('changePasswordBtn')}
            </button>
          </form>

          {error && <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] px-4 py-2.5 rounded-[var(--radius-xl2)]">{error}</p>}
          {info && <p className="text-sm text-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2.5 rounded-[var(--radius-xl2)]">{info}</p>}

          <div className="border-t border-[var(--line)]" />

          {confirmingDisable ? (
            <div className="border border-[color-mix(in_srgb,var(--danger)_40%,transparent)] rounded-[var(--radius-xl2)] p-3 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <TriangleAlert size={16} className="text-[var(--danger)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--danger)]">{t('disableConfirmText')}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDisableAccount}
                  disabled={loading}
                  className="flex-1 py-2 bg-[var(--danger)] text-white rounded-[var(--radius-xl2)] text-xs font-semibold disabled:opacity-50"
                >
                  {loading ? t('disablingBtn') : t('disableConfirmBtn')}
                </button>
                <button
                  onClick={() => setConfirmingDisable(false)}
                  className="flex-1 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] text-xs font-semibold hover:bg-[var(--surface-2)] transition-colors"
                >
                  {t('cancelBtn')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingDisable(true)}
              className="py-2 border border-[color-mix(in_srgb,var(--danger)_40%,transparent)] text-[var(--danger)] rounded-[var(--radius-xl2)] text-xs font-semibold hover:bg-[var(--danger-soft)] transition-colors"
            >
              {t('disableAccountBtn')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}