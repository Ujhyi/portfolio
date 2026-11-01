'use client';

import { useEffect, useState } from 'react';
import { Plus, X, Target } from 'lucide-react';
import { api, Budget, ApiError } from '../_lib/api-client';
import { useLanguage } from '../_lib/i18n';

const CATEGORIES = ['Potraviny', 'Reštaurácie', 'Doprava', 'Bývanie', 'Zábava', 'Zdravie', 'Nákupy', 'Účty', 'Iné'];

function progressColor(pct: number) {
  if (pct >= 100) return 'var(--danger)';
  if (pct >= 80) return '#F2C94C';
  return 'var(--accent)';
}

export function BudgetTracker({ token, refreshKey }: { token: string; refreshKey: unknown }) {
  const { t, tCategory } = useLanguage();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]!);
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const [limitAmount, setLimitAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await api.getBudgets(token);
      setBudgets(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshKey]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.upsertBudget(token, { category, period, limitAmount: Number(limitAmount) });
      setLimitAmount('');
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('budgetErrorGeneric'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cat: string) {
    try {
      await api.deleteBudget(token, cat);
      await load();
    } catch {
      // ignore
    }
  }

  const availableCategories = CATEGORIES.filter((c) => !budgets.some((b) => b.category === c));

  return (
    <div className="sp-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-[var(--muted)] underline flex items-center gap-1.5">
          {t('budgetsTitle')}
        </p>
        {!showForm && availableCategories.length > 0 && (
          <button onClick={() => setShowForm(true)} className="text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
            <Plus size={15} />
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-[var(--muted)]">...</p>
      ) : budgets.length === 0 && !showForm ? (
        <p className="text-xs text-[var(--muted)] text-center py-4">{t('budgetsEmpty')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {budgets.map((b) => (
            <div key={b.id} className="group">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-medium flex items-center gap-1.5">
                  {tCategory(b.category)}
                  <span className="text-[var(--muted)] font-normal">
                    · {b.period === 'week' ? t('budgetPeriodWeek') : t('budgetPeriodMonth')}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold tabular-nums">
                    {b.spent.toFixed(0)} / {b.limitAmount.toFixed(0)} {b.baseCurrency}
                  </span>
                  <button
                    onClick={() => handleDelete(b.category)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[var(--danger)] transition-all"
                  >
                    <X size={12} />
                  </button>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(b.percentage, 100)}%`, background: progressColor(b.percentage) }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 pt-4 border-t border-[var(--line)] flex flex-col gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-xs">
            {availableCategories.map((c) => <option key={c} value={c}>{tCategory(c)}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select value={period} onChange={(e) => setPeriod(e.target.value as 'week' | 'month')}
              className="px-3 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-xs">
              <option value="week">{t('budgetPeriodWeekOption')}</option>
              <option value="month">{t('budgetPeriodMonthOption')}</option>
            </select>
            <input type="number" step="1" min="1" required placeholder={t('budgetLimitPlaceholder')} value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              className="px-3 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-xs" />
          </div>
          {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-2 bg-[var(--accent)] text-white rounded-[var(--radius-xl2)] text-xs font-semibold disabled:opacity-50">
              {saving ? t('savingBudgetBtn') : t('addBudgetBtn')}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] text-xs font-semibold hover:bg-[var(--surface-2)] transition-colors">
              {t('cancelBtn')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}