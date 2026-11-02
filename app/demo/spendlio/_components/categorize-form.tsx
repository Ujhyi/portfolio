'use client';

import { useState, FormEvent } from 'react';
import { Sparkles } from 'lucide-react';
import { api, ApiError, Transaction } from '../_lib/api-client';
import { useLanguage } from '../_lib/i18n';

export function CategorizeForm({ token, onCategorized }: { token: string; onCategorized: (items: Transaction[]) => void }) {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const items = await api.categorize(token, text);
      onCategorized(items);
      setText('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('categorizeErrorGeneric'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="sp-card p-6">
      <p className="text-xs font-semibold text-[var(--muted)] underline mb-3 flex items-center gap-1.5">
        {t('aiAddTitle')}
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('aiTextPlaceholder')}
        className="w-full min-h-[80px] px-3 py-2.5 border border-[var(--line)] rounded-[var(--radius-xl2)] bg-[var(--surface-2)] text-sm resize-y"
      />
      {error && <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] px-4 py-2.5 rounded-[var(--radius-xl2)] mt-2">{error}</p>}
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="mt-3 w-full py-3 bg-[var(--accent)] text-white rounded-[var(--radius-xl2)] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? t('categorizingBtn') : t('categorizeBtn')}
      </button>
    </form>
  );
}