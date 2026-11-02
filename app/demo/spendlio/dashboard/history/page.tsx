'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api, Transaction } from '../../_lib/api-client';
import { useAuth } from '../../_lib/auth-context';
import { useLanguage } from '../../_lib/i18n';
import {
  filterByPeriod, filterByDateRange,
  groupTransactionsByMonth, groupTransactionsByDay,
} from '../../_lib/date-utils';
import { BASE } from '../../_lib/routes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CATEGORIES = ['Potraviny', 'Reštaurácie', 'Doprava', 'Bývanie', 'Zábava', 'Zdravie', 'Nákupy', 'Účty', 'Iné'];

type Period = 'week' | 'month' | '3months' | 'all' | 'custom';

export default function HistoryPage() {
  const { token, setToken } = useAuth();
  const { t, lang, tCategory } = useLanguage();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('month');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  

  const PERIOD_OPTIONS: { value: Period; label: string }[] = [
    { value: 'week', label: t('periodWeek') },
    { value: 'month', label: t('periodMonth') },
    { value: '3months', label: t('period3Months') },
    { value: 'all', label: t('periodAll') },
    { value: 'custom', label: t('periodCustom') },
  ];

  useEffect(() => {
    if (!token) return;
    api.getTransactions(token).then((data) => {
      setTransactions(data);
      setLoading(false);
    });
  }, [token]);

  const filtered = useMemo(() => {
    let result: Transaction[];

    if (period === 'custom') {
      result = customFrom || customTo ? filterByDateRange(transactions, customFrom, customTo) : transactions;
    } else {
      result = filterByPeriod(transactions, period);
    }

    if (selectedCategories.size > 0) {
      result = result.filter((t) => selectedCategories.has(t.category));
    }
    return result;
  }, [transactions, period, customFrom, customTo, selectedCategories]);

  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  const chartData = useMemo(() => {
    if (period === 'week' || period === 'month') {
      return groupTransactionsByDay(filtered, lang).map((d) => ({ label: d.label, total: Math.round(d.total * 100) / 100 }));
    }
    return groupTransactionsByMonth(filtered, lang).map((m) => ({ label: m.label, total: Math.round(m.total * 100) / 100 }));
  }, [filtered, period, lang]);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function handleLogout() {
    setToken(null);
    router.push(`${BASE}/login`);
  }

  if (!token) return null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      <div className="flex flex-wrap justify-between items-start gap-3 mb-6 sm:mb-8">
        <div>
          <Link
            href={`${BASE}/dashboard`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] underline underline-offset-2 hover:text-[var(--ink)] transition-colors mb-2"
          >
            <ArrowLeft size={13} />
            {t('backToDashboard')}
          </Link>
          <h1 className="sp-display text-xl sm:text-2xl font-bold tracking-tight">{t('historyTitle')}</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] px-2.5 py-2 rounded-full hover:bg-[var(--surface-2)] transition-colors whitespace-nowrap"
        >
          {t('logoutBtn')}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {PERIOD_OPTIONS.map((opt) => {
          const isActive = period === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap"
              style={{
                background: isActive ? 'var(--danger)' : 'var(--surface-2)',
                color: isActive ? '#FFFFFF' : 'var(--ink)',
                border: `1.5px solid ${isActive ? 'var(--danger)' : 'var(--line)'}`,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {period === 'custom' && (
        <div className="flex flex-wrap items-center gap-2 mb-4 sp-card p-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[var(--muted)]">{t('fromLabel')}</label>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="px-2.5 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[var(--muted)]">{t('toLabel')}</label>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="px-2.5 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-xs"
            />
          </div>
          {(customFrom || customTo) && (
            <button
              onClick={() => { setCustomFrom(''); setCustomTo(''); }}
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            >
              {t('clearBtn')}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategories.has(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap"
                style={{
                  background: isActive ? 'var(--accent)' : 'var(--surface-2)',
                  color: isActive ? '#FFFFFF' : 'var(--ink)',
                  border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--line)'}`,
                }}
              >
                {tCategory(cat)}
              </button>
            );
          })}
        {selectedCategories.size > 0 && (
          <button onClick={() => setSelectedCategories(new Set())} className="px-3 py-1.5 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
            {t('clearFilterBtn')}
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-[var(--muted)]">...</p>
      ) : (
        <>
          <div className="sp-card p-4 sm:p-6 mb-6">
            <p className="text-xs font-semibold text-[var(--muted)] mb-1">{t('totalForPeriodLabel')}</p>
            <p className="sp-display text-3xl sm:text-4xl font-bold tracking-tight mb-4 tabular-nums">{total.toFixed(2)} €</p>

            {chartData.length > 1 && (
              <div style={{ width: '100%', height: 180 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="var(--line)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={{ stroke: 'var(--line)' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(v) => [`${v} €`, '']}
                      contentStyle={{ fontSize: 12, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--surface)', color: 'var(--ink)' }}
                    />
                    <Bar dataKey="total" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="sp-card p-4 sm:p-6">
            <p className="text-xs font-semibold text-[var(--muted)] mb-3">{t('itemsLabel')} ({filtered.length})</p>
            {filtered.length === 0 ? (
              <p className="text-sm text-[var(--muted)] text-center py-8">{t('noExpensesForFilter')}</p>
            ) : (
              <div className="flex flex-col divide-y divide-[var(--line)] max-h-[480px] overflow-y-auto">
                {[...filtered].sort((a, b) => b.date.localeCompare(a.date)).map((t) => (
                  <div key={t.id} className="flex justify-between items-center py-3 gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{t.merchant}</p>
                      <p className="text-xs text-[var(--muted)] truncate">{tCategory(t.category)}{t.shop && ` · ${t.shop}`} · {t.date?.slice(0, 10)}</p>
                    </div>
                    <span className="sp-display font-semibold text-sm tabular-nums shrink-0">{t.amount.toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}