'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Transaction } from '../_lib/api-client';
import { useAuth } from '../_lib/auth-context';
import { useLanguage } from '../_lib/i18n';
import { TransactionList } from '../_components/transaction-list';
import { AddTransactionForm } from '../_components/add-transaction-form';
import { CategorizeForm } from '../_components/categorize-form';
import { AccountSettings } from '../_components/account-settings';
import { ReceiptUpload } from '../_components/receipt-upload';
import { ThemeToggle } from '../_components/theme-toggle';
import { LanguageToggle } from '../_components/language-toggle';
import { BudgetTracker } from '../_components/budget-tracker';
import { BASE } from '../_lib/routes';

export default function DashboardPage() {
  const { token, setToken } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const items = await api.getTransactions(token);
      setTransactions(items);
      setError(null);
    } catch {
      setError(t('loadErrorGeneric'));
    } finally {
      setLoading(false);
    }
  }, [token, t]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const recentTransactions = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 28);
    return transactions.filter((t) => new Date(t.date) >= cutoff);
  }, [transactions]);

  async function handleDelete(id: number) {
    if (!token) return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.deleteTransaction(token, id);
    } catch {
      loadTransactions();
    }
  }

  function handleLogout() {
    setToken(null);
    router.push(`${BASE}/login`);
  }

  if (!token) return null;

return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 overflow-x-hidden">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
        <h1 className="sp-display text-xl sm:text-2xl font-bold tracking-tight">{t('dashboardTitle')}</h1>
        <div className="flex items-center gap-1 flex-wrap">
          <div className="w-px h-5 bg-[var(--line)] mx-1 hidden sm:block" />
          <span className="text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] mr-1">{t('demoBadge')}</span>
          <div className="w-px h-5 bg-[var(--line)] mx-1 hidden sm:block" />
          <Link
            href={`${BASE}/dashboard/history`}
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] px-2.5 py-2 rounded-full hover:bg-[var(--surface-2)] transition-colors whitespace-nowrap"
          >
            {t('historyLink')}
          </Link>
          <div className="w-px h-5 bg-[var(--line)] mx-1 hidden sm:block" />
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] px-2.5 py-2 rounded-full hover:bg-[var(--surface-2)] transition-colors whitespace-nowrap"
          >
            {t('logoutBtn')}
          </button>
          <div className="w-px h-5 bg-[var(--line)] mx-1 hidden sm:block" />
          <LanguageToggle />
          <div className="w-px h-5 bg-[var(--line)] mx-1 hidden sm:block" />
          <ThemeToggle />
        </div>
      </div>

      {error && <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] px-4 py-2.5 rounded-[var(--radius-xl2)] mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-4 sm:gap-6 items-start">
        <div>
          <TransactionList
            token={token}
            transactions={recentTransactions}
            onDelete={handleDelete}
            onUpdated={() => loadTransactions()}
            loading={loading}
          />
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          <BudgetTracker token={token} refreshKey={transactions} />
          <ReceiptUpload token={token} onCategorized={() => loadTransactions()} />
          <CategorizeForm token={token} onCategorized={() => loadTransactions()} />
          <AddTransactionForm token={token} onAdded={() => loadTransactions()} />
          <AccountSettings token={token} />
        </div>
      </div>
    </main>
  );
}