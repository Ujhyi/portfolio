// DEMO version of spendlio-web/src/lib/api-client.ts
// Same `api` object and types as the real client, but every call is answered
// by an in-browser fake backend stored in localStorage. No network, no keys.

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export interface Transaction {
  id: number;
  date: string;
  merchant: string;
  shop: string | null;
  amount: number;
  currency: string;
  amountInBaseCurrency: number;
  baseCurrency: string;
  category: string;
  source: string;
}

export interface Budget {
  id: number;
  category: string;
  period: string;
  limitAmount: number;
  spent: number;
  baseCurrency: string;
  percentage: number;
}

/* ---------------- storage ---------------- */

export const DEMO_EMAIL = 'demo@spendlio.app';
export const DEMO_PASSWORD = 'demo1234';
const DB_KEY = 'spendlio_demo_db_v2';
const TOKEN_KEY = 'spendlio_demo_token';
const MAX_AGE_DAYS = 3; // reseed after a few days so the sample dates stay "recent"

type StoredTx = Omit<Transaction, 'amountInBaseCurrency' | 'baseCurrency'>;
type StoredBudget = { id: number; category: string; period: string; limitAmount: number };
interface Db {
  savedAt: number;
  baseCurrency: string;
  transactions: StoredTx[];
  budgets: StoredBudget[];
}

// how many units of a currency one EUR buys (fixed demo rates)
const RATES: Record<string, number> = { EUR: 1, CZK: 25.3, USD: 1.08, GBP: 0.85, PLN: 4.3 };

function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
}

function seedDb(): Db {
  // [days ago, product, shop, amount, currency, category, source]
  const rows: [number, string, string | null, number, string, string, string][] = [
    [0, 'Coffee and croissant', 'Corner Bistro', 4.8, 'EUR', 'Reštaurácie', 'ai_text'],
    [0, 'Bread rolls', 'Billa', 0.9, 'EUR', 'Potraviny', 'ai_receipt'],
    [1, 'Milk 1.5%', 'Lidl', 1.29, 'EUR', 'Potraviny', 'ai_receipt'],
    [1, 'Cheddar cheese', 'Lidl', 3.49, 'EUR', 'Potraviny', 'ai_receipt'],
    [1, 'Bananas', 'Lidl', 1.85, 'EUR', 'Potraviny', 'ai_receipt'],
    [2, 'Fuel', 'Slovnaft', 62.4, 'EUR', 'Doprava', 'manual'],
    [3, 'Lunch menu', 'The Mill Restaurant', 8.9, 'EUR', 'Reštaurácie', 'ai_text'],
    [4, 'Spotify Premium', null, 10.99, 'EUR', 'Zábava', 'manual'],
    [5, 'Vitamin D', 'Dr.Max', 7.9, 'EUR', 'Zdravie', 'manual'],
    [6, 'Weekly groceries', 'Tesco', 48.35, 'EUR', 'Potraviny', 'ai_text'],
    [8, 'Cinema', 'Cinema City', 9.9, 'EUR', 'Zábava', 'ai_text'],
    [9, 'Hoodie', 'Zara', 39.95, 'EUR', 'Nákupy', 'manual'],
    [10, 'Pizza', 'Pizzeria Napoli', 14.5, 'EUR', 'Reštaurácie', 'ai_text'],
    [12, 'Internet', null, 19.99, 'EUR', 'Účty', 'manual'],
    [13, 'Weekly groceries', 'Kaufland', 61.2, 'EUR', 'Potraviny', 'ai_receipt'],
    [15, 'Taxi', 'Bolt', 8.4, 'EUR', 'Doprava', 'ai_text'],
    [17, 'Dinner', 'Sushi Bar', 32.0, 'EUR', 'Reštaurácie', 'ai_text'],
    [19, 'Monthly transit pass', null, 26.9, 'EUR', 'Doprava', 'manual'],
    [21, 'Coffee', 'Castle Café', 4.2, 'EUR', 'Reštaurácie', 'ai_text'],
    [23, 'Weekly groceries', 'Lidl', 42.1, 'EUR', 'Potraviny', 'ai_receipt'],
    [25, 'Beer and dinner', 'Prague Pub', 480, 'CZK', 'Reštaurácie', 'ai_text'],
    [29, 'Rent', null, 650, 'EUR', 'Bývanie', 'manual'],
    [31, 'Electricity', null, 54, 'EUR', 'Účty', 'manual'],
    [34, 'Concert', null, 35, 'EUR', 'Zábava', 'manual'],
    [38, 'Sneakers', 'Footshop', 89.9, 'EUR', 'Nákupy', 'manual'],
    [45, 'Weekly groceries', 'Tesco', 55.6, 'EUR', 'Potraviny', 'ai_receipt'],
    [52, 'Dentist', null, 40, 'EUR', 'Zdravie', 'manual'],
    [59, 'Rent', null, 650, 'EUR', 'Bývanie', 'manual'],
    [61, 'Electricity', null, 54, 'EUR', 'Účty', 'manual'],
    [66, 'Netflix', null, 13.99, 'EUR', 'Zábava', 'manual'],
    [74, 'Flight ticket', 'Ryanair', 79, 'EUR', 'Doprava', 'manual'],
    [82, 'Weekly groceries', 'Kaufland', 67.3, 'EUR', 'Potraviny', 'ai_receipt'],
    [89, 'Rent', null, 650, 'EUR', 'Bývanie', 'manual'],
    [96, 'Birthday gift', null, 25, 'EUR', 'Iné', 'manual'],
  ];
  return {
    savedAt: Date.now(),
    baseCurrency: 'EUR',
    transactions: rows.map(([d, merchant, shop, amount, currency, category, source], i) => ({
      id: i + 1,
      date: daysAgo(d),
      merchant,
      shop,
      amount,
      currency,
      category,
      source,
    })),
    budgets: [
      { id: 1, category: 'Potraviny', period: 'month', limitAmount: 250 },
      { id: 2, category: 'Reštaurácie', period: 'month', limitAmount: 120 },
      { id: 3, category: 'Zábava', period: 'week', limitAmount: 30 },
    ],
  };
}

function loadDb(): Db {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const db = JSON.parse(raw) as Db;
      if ((Date.now() - db.savedAt) / 86_400_000 < MAX_AGE_DAYS) return db;
    }
  } catch {}
  const db = seedDb();
  saveDb(db);
  return db;
}

function saveDb(db: Db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {}
}

function mutate<T>(fn: (db: Db) => T): T {
  const db = loadDb();
  const result = fn(db);
  saveDb(db);
  return result;
}

export function resetDemoData() {
  saveDb(seedDb());
}

/* ---------------- helpers ---------------- */

function isEn() {
  try {
    return localStorage.getItem('spendlio_demo_lang') !== 'sk';
  } catch {
    return true;
  }
}
const msg = (sk: string, en: string) => (isEn() ? en : sk);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const round2 = (n: number) => Math.round(n * 100) / 100;

function convert(amount: number, from: string, to: string) {
  return round2((amount / (RATES[from] ?? 1)) * (RATES[to] ?? 1));
}

function present(t: StoredTx, base: string): Transaction {
  return { ...t, amountInBaseCurrency: convert(t.amount, t.currency, base), baseCurrency: base };
}

const nextId = (list: { id: number }[]) => Math.max(0, ...list.map((x) => x.id)) + 1;

function requireToken(token: string | undefined) {
  if (!token) throw new ApiError(401, msg('Neautorizovaný prístup.', 'Unauthorized.'));
}

/* ---------------- "AI" ---------------- */

const CATEGORY_RULES: [RegExp, string][] = [
  [/tesco|lidl|billa|kaufland|coop|potravin|chlieb|rožk|mlieko|syr|maslo|vajc|banán|jablk|zelenin|ovoc|grocer|bread|milk|cheese|eggs/i, 'Potraviny'],
  [/reštaur|restaur|obed|večer|lunch|dinner|pizza|burger|kebab|sushi|káva|kava|coffee|bistro|kaviar|pivo|beer/i, 'Reštaurácie'],
  [/benzín|benzin|nafta|tankov|fuel|gas|slovnaft|omv|shell|taxi|bolt|uber|vlak|train|bus|mhd|lístok|ticket|parking|letenk|flight/i, 'Doprava'],
  [/nájom|najom|rent|hypot|mortgage/i, 'Bývanie'],
  [/elektrin|plyn|internet|mobil|paušál|telef|energi|voda|water|electric|bill/i, 'Účty'],
  [/kino|cinema|netflix|spotify|koncert|concert|divadl|theatre|hra|game|steam|youtube/i, 'Zábava'],
  [/lekáre|lekare|pharmacy|liek|vitamín|vitamin|doktor|doctor|zubár|dentist|dr\.?max/i, 'Zdravie'],
  [/zara|h&m|tričk|nohav|topánk|tenisk|mikin|bund|shirt|shoes|jacket|alza|amazon|elektronik|darček|gift/i, 'Nákupy'],
];

const KNOWN_SHOPS = ['Tesco', 'Lidl', 'Billa', 'Kaufland', 'Coop', 'Slovnaft', 'OMV', 'Shell', 'Bolt', 'Uber', 'Zara', 'Alza', 'Dr.Max', 'dm'];

function guessCategory(text: string) {
  return CATEGORY_RULES.find(([re]) => re.test(text))?.[1] ?? 'Iné';
}

// Turns e.g. "15.03 Tesco 24,50e, obed v reštaurácii 12e" into separate items.
function fakeParse(text: string, baseCurrency: string): Omit<StoredTx, 'id'>[] {
  const today = new Date();
  return text
    .split(/\n|;|,\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .flatMap((segment) => {
      let rest = segment;
      let date = toISODate(today);

      const dm = rest.match(/^(\d{1,2})\.(\d{1,2})\.?(\d{4})?\s+/);
      if (dm && Number(dm[1]) <= 31 && Number(dm[2]) <= 12) {
        const y = dm[3] ? Number(dm[3]) : today.getFullYear();
        date = toISODate(new Date(y, Number(dm[2]) - 1, Number(dm[1])));
        rest = rest.slice(dm[0].length);
      }

      const amounts = [...rest.matchAll(/(\d+(?:[.,]\d{1,2})?)\s*(€|eur|eura|e|kč|czk|\$|usd|£|gbp|zł|pln)?(?![\w])/gi)];
      const last = amounts[amounts.length - 1];
      if (!last) return [];
      const amount = parseFloat(last[1].replace(',', '.'));
      if (!(amount > 0)) return [];

      const unit = (last[2] ?? '').toLowerCase();
      const currency =
        unit === 'kč' || unit === 'czk' ? 'CZK'
        : unit === '$' || unit === 'usd' ? 'USD'
        : unit === '£' || unit === 'gbp' ? 'GBP'
        : unit === 'zł' || unit === 'pln' ? 'PLN'
        : unit ? 'EUR'
        : baseCurrency;

      rest = (rest.slice(0, last.index) + rest.slice((last.index ?? 0) + last[0].length))
        .replace(/\s{2,}/g, ' ')
        .replace(/[-–:]\s*$/, '')
        .trim();

      const shop = KNOWN_SHOPS.find((s) => new RegExp(`\\b${s.replace('.', '\\.')}\\b`, 'i').test(rest)) ?? null;
      let merchant = shop ? rest.replace(new RegExp(`\\b${shop.replace('.', '\\.')}\\b`, 'i'), '').trim() : rest;
      if (!merchant) merchant = shop ? msg('Nákup', 'Purchase') : msg('Výdavok', 'Expense');
      merchant = merchant.charAt(0).toUpperCase() + merchant.slice(1);

      return [{
        date,
        merchant,
        shop,
        amount,
        currency,
        category: guessCategory(segment),
        source: 'ai_text',
      }];
    });
}

// Every uploaded photo "contains" this receipt
function fakeReceipt(baseCurrency: string): Omit<StoredTx, 'id'>[] {
  const items: [string, number, string][] = [
    ['Milk 1.5%', 1.29, 'Potraviny'],
    ['Wholegrain bread', 2.19, 'Potraviny'],
    ['Plain yogurt', 0.89, 'Potraviny'],
    ['Apples', 2.45, 'Potraviny'],
    ['Shampoo', 4.99, 'Nákupy'],
  ];
  return items.map(([merchant, amountEur, category]) => ({
    date: toISODate(new Date()),
    merchant,
    shop: 'Lidl',
    amount: convert(amountEur, 'EUR', baseCurrency),
    currency: baseCurrency,
    category,
    source: 'ai_receipt',
  }));
}

/* ---------------- budgets ---------------- */

function periodStart(period: string) {
  const now = new Date();
  if (period === 'week') {
    const d = new Date(now);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function computeBudgets(db: Db): Budget[] {
  return db.budgets.map((b) => {
    const from = periodStart(b.period);
    const spent = round2(
      db.transactions
        .filter((t) => t.category === b.category)
        .filter((t) => {
          const [y, m, d] = t.date.slice(0, 10).split('-').map(Number);
          return new Date(y, m - 1, d) >= from;
        })
        .reduce((s, t) => s + convert(t.amount, t.currency, db.baseCurrency), 0)
    );
    const limitAmount = convert(b.limitAmount, 'EUR', db.baseCurrency);
    return {
      ...b,
      limitAmount,
      spent,
      baseCurrency: db.baseCurrency,
      percentage: limitAmount > 0 ? Math.round((spent / limitAmount) * 100) : 0,
    };
  });
}

/* ---------------- token helpers (same shape as the real client) ---------------- */

function storeToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearStoredToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

/* ---------------- api (same signatures as the real one) ---------------- */

export const api = {
  login: async (email: string, password: string) => {
    await wait(500);
    if (!email.trim() || !password) {
      throw new ApiError(400, msg('Zadaj email a heslo.', 'Enter an email and a password.'));
    }
    const data = { token: 'demo-access-token', refreshToken: 'demo-refresh-token' };
    storeToken(data.token);
    return data;
  },

  logout: async () => {
    clearStoredToken();
  },

  changePassword: async (token: string, _oldPassword: string, newPassword: string) => {
    requireToken(token);
    await wait(500);
    if (newPassword.length < 8) {
      throw new ApiError(400, msg('Heslo musí mať aspoň 8 znakov.', 'Password must be at least 8 characters.'));
    }
    return { success: true };
  },

  disableAccount: async (token: string): Promise<{ disabled: true; message: string }> => {
    requireToken(token);
    await wait(400);
    throw new ApiError(400, msg('V demo režime sa účet nedá deaktivovať.', 'Accounts cannot be disabled in demo mode.'));
  },

  getTransactions: async (token: string) => {
    requireToken(token);
    await wait(350);
    const db = loadDb();
    return db.transactions.map((t) => present(t, db.baseCurrency));
  },

  createTransaction: async (
    token: string,
    data: { date: string; merchant: string; shop?: string; amount: number; category: string }
  ) => {
    requireToken(token);
    await wait(300);
    if (!data.merchant.trim() || !(data.amount > 0)) {
      throw new ApiError(400, msg('Vyplň produkt a kladnú sumu.', 'Fill in a product and a positive amount.'));
    }
    return mutate((db) => {
      const tx: StoredTx = {
        id: nextId(db.transactions),
        date: data.date,
        merchant: data.merchant.trim(),
        shop: data.shop?.trim() || null,
        amount: round2(data.amount),
        currency: db.baseCurrency,
        category: data.category,
        source: 'manual',
      };
      db.transactions.push(tx);
      return present(tx, db.baseCurrency);
    });
  },

  updateTransaction: async (
    token: string,
    id: number,
    data: Partial<{ date: string; merchant: string; shop: string; amount: number; currency: string; category: string }>
  ) => {
    requireToken(token);
    await wait(300);
    if (data.amount !== undefined && !(data.amount > 0)) {
      throw new ApiError(400, msg('Suma musí byť kladná.', 'Amount must be positive.'));
    }
    return mutate((db) => {
      const tx = db.transactions.find((t) => t.id === id);
      if (!tx) throw new ApiError(404, msg('Výdavok sa nenašiel.', 'Expense not found.'));
      Object.assign(tx, {
        ...(data.date !== undefined && { date: data.date }),
        ...(data.merchant !== undefined && { merchant: data.merchant }),
        ...(data.shop !== undefined && { shop: data.shop || null }),
        ...(data.amount !== undefined && { amount: round2(data.amount) }),
        ...(data.currency !== undefined && { currency: data.currency }),
        ...(data.category !== undefined && { category: data.category }),
      });
      return present(tx, db.baseCurrency);
    });
  },

  deleteTransaction: async (token: string, id: number) => {
    requireToken(token);
    await wait(200);
    return mutate((db) => {
      db.transactions = db.transactions.filter((t) => t.id !== id);
      return { deleted: true };
    });
  },

  categorize: async (token: string, text: string) => {
    requireToken(token);
    await wait(1400);
    return mutate((db) => {
      const parsed = fakeParse(text, db.baseCurrency);
      if (!parsed.length) {
        throw new ApiError(
          400,
          msg('V texte som nenašiel žiadnu sumu. Skús napr. "pizza 12,50e".', 'No amount found in the text. Try e.g. "pizza 12.50e".')
        );
      }
      let id = nextId(db.transactions) - 1;
      const created = parsed.map((p) => ({ ...p, id: ++id }));
      db.transactions.push(...created);
      return created.map((t) => present(t, db.baseCurrency));
    });
  },

  categorizeReceipt: async (token: string, _file: File) => {
    requireToken(token);
    await wait(2600); // long enough for the progress bar to animate
    return mutate((db) => {
      let id = nextId(db.transactions) - 1;
      const created = fakeReceipt(db.baseCurrency).map((p) => ({ ...p, id: ++id }));
      db.transactions.push(...created);
      return created.map((t) => present(t, db.baseCurrency));
    });
  },

  getSettings: async (token: string) => {
    requireToken(token);
    return { baseCurrency: loadDb().baseCurrency };
  },

  updateSettings: async (token: string, baseCurrency: string) => {
    requireToken(token);
    await wait(250);
    return mutate((db) => {
      db.baseCurrency = baseCurrency;
      return { baseCurrency };
    });
  },

  getBudgets: async (token: string) => {
    requireToken(token);
    await wait(250);
    return computeBudgets(loadDb());
  },

  upsertBudget: async (token: string, data: { category: string; period: string; limitAmount: number }) => {
    requireToken(token);
    await wait(300);
    if (!(data.limitAmount > 0)) {
      throw new ApiError(400, msg('Limit musí byť kladný.', 'Limit must be positive.'));
    }
    return mutate((db) => {
      const limitEur = convert(data.limitAmount, db.baseCurrency, 'EUR');
      const existing = db.budgets.find((b) => b.category === data.category);
      if (existing) Object.assign(existing, { period: data.period, limitAmount: limitEur });
      else db.budgets.push({ id: nextId(db.budgets), category: data.category, period: data.period, limitAmount: limitEur });
      return computeBudgets(db).find((b) => b.category === data.category)!;
    });
  },

  deleteBudget: async (token: string, category: string) => {
    requireToken(token);
    await wait(200);
    return mutate((db) => {
      db.budgets = db.budgets.filter((b) => b.category !== category);
      return { deleted: true };
    });
  },
};
