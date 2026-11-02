'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Check } from 'lucide-react';
import { Transaction, api } from '../_lib/api-client';
import { useLanguage } from '../_lib/i18n';

export function ReceiptUpload({ token, onCategorized }: { token: string; onCategorized: (items: Transaction[]) => void }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function startFakeProgress() {
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        // rýchlejšie na začiatku, spomaľuje smerom k 90 %
        const step = prev < 40 ? 8 : prev < 70 ? 4 : 1.5;
        return Math.min(prev + step, 90);
      });
    }, 200);
  }

  function stopFakeProgress() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setDone(false);
    setLoading(true);
    startFakeProgress();

    try {
      // Demo: the photo never leaves the browser; the mock returns a sample receipt
      const data = await api.categorizeReceipt(token, file);

      stopFakeProgress();
      setProgress(100);
      setDone(true);
      onCategorized(data);

      setTimeout(() => {
        setLoading(false);
        setDone(false);
        setProgress(0);
      }, 700);
    } catch (err) {
      stopFakeProgress();
      setError(err instanceof Error ? err.message : t('receiptErrorGeneric'));
      setLoading(false);
      setProgress(0);
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="sp-card p-4 sm:p-6">
      <p className="text-xs font-semibold text-[var(--muted)] underline mb-3">{t('receiptTitle')}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="receipt-input"
        disabled={loading}
      />

      <label
        htmlFor="receipt-input"
        className={`flex flex-col items-center justify-center gap-3 w-full py-8 border-2 border-dashed rounded-[var(--radius-xl2)] text-center text-sm font-medium transition-colors overflow-hidden relative ${
          loading ? 'border-line cursor-wait' : 'border-line cursor-pointer hover:border-[var(--accent)] hover:bg-accent-soft'
        }`}
      >
        {loading ? (
          <>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: done ? 'var(--accent)' : 'var(--accent-soft)' }}
            >
              {done ? (
                <Check size={18} className="text-white" strokeWidth={2.5} />
              ) : (
                <Camera size={18} className="text-[var(--accent)]" strokeWidth={1.75} />
              )}
            </div>
            <span>{done ? t('receiptDone') : t('receiptProcessing')}</span>

            <div className="w-full max-w-[200px] h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all ease-out"
                style={{
                  width: `${progress}%`,
                  background: 'var(--accent)',
                  transitionDuration: progress === 100 ? '200ms' : '300ms',
                }}
              />
            </div>
            <span className="text-[11px] text-[var(--muted)] tabular-nums">{Math.round(progress)}%</span>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
              <Camera size={18} className="text-[var(--accent)]" strokeWidth={1.75} />
            </div>
            {t('receiptUploadLabel')}
          </>
        )}
      </label>

      <p className="text-[11px] text-[var(--muted)] mt-2">{t('demoReceiptHint')}</p>

      {error && <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] px-4 py-2.5 rounded-[var(--radius-xl2)] mt-3">{error}</p>}
    </div>
  );
}