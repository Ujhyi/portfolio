import { Transaction } from './api-client';
import { Lang } from './i18n';

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 6);
  return d;
}

function formatShort(d: Date): string {
  return `${d.getDate()}.${d.getMonth() + 1}.`;
}

export function getWeekLabel(weekStart: Date, lang: Lang = 'sk'): string {
  const now = new Date();
  const thisWeekStart = getWeekStart(now);
  const diffWeeks = Math.round((thisWeekStart.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));

  if (diffWeeks === 0) return lang === 'en' ? 'This week' : 'Tento týždeň';
  if (diffWeeks === 1) return lang === 'en' ? 'Last week' : 'Minulý týždeň';

  const weekEnd = getWeekEnd(weekStart);
  return `${formatShort(weekStart)} – ${formatShort(weekEnd)}`;
}

// Local YYYY-MM-DD key. The original used toISOString(), which shifts the
// week key one day back in timezones east of UTC (e.g. Bratislava).
function localKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseLocalKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export interface WeekGroup {
  weekKey: string;
  label: string;
  items: Transaction[];
  total: number;
}

export function groupTransactionsByWeek(transactions: Transaction[], lang: Lang = 'sk'): WeekGroup[] {
  const groups = new Map<string, Transaction[]>();

  for (const t of transactions) {
    const weekStart = getWeekStart(new Date(t.date));
    const key = localKey(weekStart);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }

  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([weekKey, items]) => ({
      weekKey,
      label: getWeekLabel(parseLocalKey(weekKey), lang),
      items: items.sort((a, b) => b.date.localeCompare(a.date)),
      total: items.reduce((sum, t) => sum + t.amountInBaseCurrency, 0),
    }));
}

export interface MonthGroup {
  monthKey: string;
  label: string;
  total: number;
}

const MONTH_NAMES: Record<Lang, string[]> = {
  sk: ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export function groupTransactionsByMonth(transactions: Transaction[], lang: Lang = 'sk'): MonthGroup[] {
  const groups = new Map<string, number>();

  for (const t of transactions) {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    groups.set(key, (groups.get(key) ?? 0) + t.amountInBaseCurrency);
  }

  return Array.from(groups.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([monthKey, total]) => {
      const [year, month] = monthKey.split('-');
      return { monthKey, label: `${MONTH_NAMES[lang][Number(month) - 1]} ${year}`, total };
    });
}

export interface DayGroup {
  dayKey: string;
  label: string;
  total: number;
}

const DAY_NAMES: Record<Lang, string[]> = {
  sk: ['ne', 'po', 'ut', 'st', 'št', 'pi', 'so'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

export function groupTransactionsByDay(transactions: Transaction[], lang: Lang = 'sk'): DayGroup[] {
  const groups = new Map<string, number>();

  for (const t of transactions) {
    const key = t.date.slice(0, 10);
    groups.set(key, (groups.get(key) ?? 0) + t.amountInBaseCurrency);
  }

  return Array.from(groups.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([dayKey, total]) => {
      const d = new Date(dayKey);
      return { dayKey, label: `${DAY_NAMES[lang][d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`, total };
    });
}

export function filterByPeriod(transactions: Transaction[], period: 'week' | 'month' | '3months' | 'all'): Transaction[] {
  if (period === 'all') return transactions;

  const now = new Date();
  let cutoff: Date;

  if (period === 'week') {
    cutoff = getWeekStart(now);
  } else if (period === 'month') {
    cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    cutoff = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  }

  return transactions.filter((t) => new Date(t.date) >= cutoff);
}

export function filterByDateRange(transactions: Transaction[], from: string, to: string): Transaction[] {
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;
  if (toDate) toDate.setHours(23, 59, 59, 999);

  return transactions.filter((t) => {
    const d = new Date(t.date);
    if (fromDate && d < fromDate) return false;
    if (toDate && d > toDate) return false;
    return true;
  });
}