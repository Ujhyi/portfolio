'use client';

import { useState, FormEvent } from 'react';
import { api, ApiError, Transaction } from '../_lib/api-client';
import { useLanguage } from '../_lib/i18n';

const CATEGORIES = ['Potraviny', 'Reštaurácie', 'Doprava', 'Bývanie', 'Zábava', 'Zdravie', 'Nákupy', 'Účty', 'Iné'];

export function AddTransactionForm({ token, onAdded }: { token: string; onAdded: (t: Transaction) => void }) {
  const { t, tCategory } = useLanguage();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [merchant, setMerchant] = useState('');
  const [shop, setShop] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]!);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const created = await api.createTransaction(token, {
        date, merchant, shop: shop || undefined, amount: Number(amount), category,
      });
      onAdded(created);
      setMerchant('');
      setShop('');
      setAmount('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('addErrorGeneric'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="sp-card p-4 sm:p-6">
      <p className="text-xs font-semibold text-[var(--muted)] underline mb-3">{t('addManualTitle')}</p>
      <div className="grid grid-cols-2 gap-2.5">
        <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2.5 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-sm col-span-2" />
        <input type="text" required placeholder={t('productPlaceholder')} value={merchant} onChange={(e) => setMerchant(e.target.value)}
          className="px-3 py-2.5 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-sm col-span-2" />
        <input type="text" placeholder={t('shopOptionalPlaceholder')} value={shop} onChange={(e) => setShop(e.target.value)}
          className="px-3 py-2.5 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-sm col-span-2" />
        <input type="number" step="0.01" required placeholder={t('amountPlaceholder')} value={amount} onChange={(e) => setAmount(e.target.value)}
          className="px-3 py-2.5 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-sm col-span-2" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2.5 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-sm col-span-2">
          {CATEGORIES.map((c) => <option key={c} value={c}>{tCategory(c)}</option>)}
        </select>
      </div>
      {error && <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] px-4 py-2.5 rounded-[var(--radius-xl2)] mt-3">{error}</p>}
      <button type="submit" disabled={loading}
        className="mt-3 w-full py-2.5 border border-[var(--line)] rounded-[var(--radius-xl2)] text-sm font-semibold hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50">
        {loading ? t('addingBtn') : t('addBtn')}
      </button>
    </form>
  );
}