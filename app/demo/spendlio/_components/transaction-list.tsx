'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, X, Check, Receipt, ArrowRight } from 'lucide-react';
import { Transaction, api, ApiError } from '../_lib/api-client';
import { groupTransactionsByWeek } from '../_lib/date-utils';
import { useLanguage } from '../_lib/i18n';
import { BASE } from '../_lib/routes';

const CATEGORIES = ['Potraviny', 'Reštaurácie', 'Doprava', 'Bývanie', 'Zábava', 'Zdravie', 'Nákupy', 'Účty', 'Iné'];
const CURRENCIES = ['EUR', 'CZK', 'USD', 'GBP', 'PLN'];

const CATEGORY_COLORS: Record<string, string> = {
  Potraviny: '#7DDB63', Reštaurácie: '#FF8A65', Doprava: '#5FA8FF', Bývanie: '#E0A85B',
  Zábava: '#C792EA', Zdravie: '#4FD8C4', Nákupy: '#F2C94C', Účty: '#9AA0A6', Iné: '#B0B3B8',
};

function TransactionSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-[var(--line)]">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between items-center py-3.5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--surface-2)]" />
            <div>
              <div className="h-3.5 w-28 bg-[var(--surface-2)] rounded-md mb-1.5" />
              <div className="h-3 w-16 bg-[var(--surface-2)] rounded-md" />
            </div>
          </div>
          <div className="h-4 w-12 bg-[var(--surface-2)] rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function TransactionList({
  token,
  transactions,
  onDelete,
  onUpdated,
  loading,
}: {
  token: string;
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onUpdated: () => void;
  loading?: boolean;
}) {
  const { t, lang, tCategory } = useLanguage();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<Transaction>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsedWeeks, setCollapsedWeeks] = useState<Set<string>>(new Set());
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

  const total = transactions.reduce((sum, t) => sum + t.amountInBaseCurrency, 0);
  const displayBaseCurrency = transactions[0]?.baseCurrency ?? 'EUR';
  const weekGroups = groupTransactionsByWeek(transactions, lang);

  function toggleWeek(weekKey: string) {
    setCollapsedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekKey)) next.delete(weekKey);
      else next.add(weekKey);
      return next;
    });
  }

  function startEdit(t: Transaction) {
    setEditingId(t.id);
    setDraft({ merchant: t.merchant, shop: t.shop ?? '', amount: t.amount, currency: t.currency, category: t.category, date: t.date.slice(0, 10) });
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
    setError(null);
  }

  async function saveEdit(id: number) {
    setSaving(true);
    setError(null);
    try {
      await api.updateTransaction(token, id, {
        merchant: draft.merchant,
        shop: draft.shop || undefined,
        amount: Number(draft.amount),
        currency: draft.currency,
        category: draft.category,
        date: draft.date,
      });
      setEditingId(null);
      onUpdated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('updateErrorGeneric'));
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteClick(id: number) {
    if (confirmingDeleteId === id) {
      onDelete(id);
      setConfirmingDeleteId(null);
    } else {
      setConfirmingDeleteId(id);
    }
  }

  function renderRow(tx: Transaction) {
    const color = CATEGORY_COLORS[tx.category] ?? '#9AA0A6';

    if (editingId === tx.id) {
      return (
        <div key={tx.id} className="py-3.5 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={draft.date ?? ''} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
              className="px-3 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-xs col-span-2" />
            <input type="text" placeholder={t('productPlaceholder')} value={draft.merchant ?? ''} onChange={(e) => setDraft((d) => ({ ...d, merchant: e.target.value }))}
              className="px-3 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-xs col-span-2" />
            <input type="text" placeholder={t('shopPlaceholder')} value={draft.shop ?? ''} onChange={(e) => setDraft((d) => ({ ...d, shop: e.target.value }))}
              className="px-3 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-xs" />
            <input type="number" step="0.01" placeholder={t('amountPlaceholder')} value={draft.amount ?? ''} onChange={(e) => setDraft((d) => ({ ...d, amount: Number(e.target.value) }))}
              className="px-3 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-xs" />
            <select value={draft.currency ?? 'EUR'} onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))}
              className="px-3 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-xs">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={draft.category ?? ''} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              className="px-3 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-xs col-span-2">
              {CATEGORIES.map((c) => <option key={c} value={c}>{tCategory(c)}</option>)}
            </select>
          </div>
          {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => saveEdit(tx.id)} disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[var(--accent)] text-white rounded-[var(--radius-xl2)] text-xs font-semibold disabled:opacity-50 transition-opacity">
              <Check size={13} strokeWidth={2.5} />
              {saving ? t('savingBtn') : t('saveBtn')}
            </button>
            <button onClick={cancelEdit}
              className="flex-1 py-2 border border-[var(--line)] rounded-[var(--radius-xl2)] text-xs font-semibold hover:bg-[var(--surface-2)] transition-colors">
              {t('cancelBtn')}
            </button>
          </div>
        </div>
      );
    }

    const isConfirmingDelete = confirmingDeleteId === tx.id;

    return (
      <div key={tx.id} className="group flex justify-between items-center py-3.5 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: `${color}22` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{tx.merchant}</p>
            <p className="text-xs text-[var(--muted)] truncate">
              {tCategory(tx.category)}{tx.shop && ` · ${tx.shop}`} · {tx.date?.slice(0, 10)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <span className="sp-display font-semibold text-sm mr-1 tabular-nums whitespace-nowrap">
            {tx.amount.toFixed(2)} {tx.currency}
            {tx.currency !== tx.baseCurrency && (
              <span className="text-[var(--muted)] font-normal text-xs ml-1">
                (≈{tx.amountInBaseCurrency.toFixed(2)} {tx.baseCurrency})
              </span>
            )}
          </span>
          {isConfirmingDelete ? (
            <button
              onClick={() => handleDeleteClick(tx.id)}
              className="text-[11px] font-semibold px-2.5 py-1.5 bg-[var(--danger)] text-white rounded-full whitespace-nowrap"
            >
              {t('confirmDeleteBtn')}
            </button>
          ) : (
            <>
              <button
                onClick={() => startEdit(tx)}
                className="p-2 text-[var(--muted)] opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:text-[var(--ink)] transition-all rounded-full hover:bg-[var(--surface-2)]"
                aria-label="Edit"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => handleDeleteClick(tx.id)}
                className="p-2 text-[var(--muted)] opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:text-[var(--danger)] transition-all rounded-full hover:bg-[var(--danger-soft)]"
                aria-label="Delete"
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="sp-card p-4 sm:p-6">
      <div className="flex justify-between items-baseline mb-1">
        <p className="text-xs font-semibold text-[var(--muted)]">{t('totalSpentLabel')}</p>
        <p className="text-xs text-[var(--muted)]">{transactions.length} {t('itemsSuffix')}</p>
      </div>
      <p className="sp-display text-3xl sm:text-4xl font-bold tracking-tight mb-5 tabular-nums">
        {total.toFixed(2)} {displayBaseCurrency}
      </p>

      {loading ? (
        <TransactionSkeleton />
      ) : weekGroups.length === 0 ? (
        <div className="flex flex-col items-center text-center py-10 gap-2">
          <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-1">
            <Receipt size={20} className="text-[var(--muted)]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium">{t('noExpensesTitle')}</p>
          <p className="text-xs text-[var(--muted)]">{t('noExpensesHint')}</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {weekGroups.map((week, idx) => {
            const isCollapsed = collapsedWeeks.has(week.weekKey);
            return (
              <div key={week.weekKey} className={idx > 0 ? 'mt-1' : ''}>
                <button
                  onClick={() => toggleWeek(week.weekKey)}
                  className="w-full flex justify-between items-center py-2.5 border-b border-[var(--line)]"
                >
                  <span className="text-xs font-semibold text-[var(--muted)] flex items-center gap-1.5">
                    <span className={`inline-block transition-transform ${isCollapsed ? '-rotate-90' : ''}`}>▾</span>
                    {week.label}
                    <span className="font-normal">· {week.items.length}</span>
                  </span>
                  <span className="text-xs font-semibold tabular-nums">{week.total.toFixed(2)} {displayBaseCurrency}</span>
                </button>
                {!isCollapsed && (
                  <div className="flex flex-col divide-y divide-[var(--line)]">
                    {week.items.map(renderRow)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[var(--line)] text-center">
        <Link
          href={`${BASE}/dashboard/history`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          {t('viewOlderLink')}
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}