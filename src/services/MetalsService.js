/**
 * MetalsService.js
 *
 * Fetches precious metals spot prices.
 *
 * HOW TO SWITCH TO A REAL API:
 *   1. Sign up at https://goldapi.io and get a free API key.
 *   2. Set USE_MOCK = false and GOLDAPI_KEY = 'your-key-here'.
 *   3. The real endpoint and mock share the same return shape, so
 *      screens need no changes.
 */

const USE_MOCK = true;
const GOLDAPI_KEY = 'YOUR_GOLDAPI_IO_KEY';
const GOLDAPI_BASE = 'https://www.goldapi.io/api';

// ---------- Metal definitions ----------

export const METALS = [
  {
    id: 'gold',
    name: 'Gold',
    symbol: 'XAU',
    karat: '24K',
    unit: 'per troy oz',
    icon: '🥇',
    accentColor: '#EF9F27',
    basePrice: 3320.5,
    volatility: 8,
  },
  {
    id: 'silver',
    name: 'Silver',
    symbol: 'XAG',
    karat: '999',
    unit: 'per troy oz',
    icon: '🥈',
    accentColor: '#888780',
    basePrice: 33.82,
    volatility: 0.4,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    symbol: 'XPT',
    karat: '950',
    unit: 'per troy oz',
    icon: '💎',
    accentColor: '#378ADD',
    basePrice: 1067.4,
    volatility: 12,
  },
  {
    id: 'palladium',
    name: 'Palladium',
    symbol: 'XPD',
    karat: '999',
    unit: 'per troy oz',
    icon: '⚗️',
    accentColor: '#1D9E75',
    basePrice: 1124.8,
    volatility: 20,
  },
];

// ---------- Shape returned by both mock and real API ----------
// {
//   price:          number   (current spot price, USD)
//   change:         number   (change from previous close)
//   changePercent:  number   (change %, e.g. 0.45 = 0.45%)
//   prevClose:      number
//   prevOpen:       number
//   dayHigh:        number
//   dayLow:         number
//   weekHigh:       number
//   weekLow:        number
//   fetchedAt:      string   (HH:MM:SS)
//   date:           string   (human-readable full date)
// }

// ---------- Mock implementation ----------

const _mockPrevPrices = {};

function _mockFetchMetal(metal) {
  return new Promise((resolve, reject) => {
    const delay = 600 + Math.random() * 1600;

    setTimeout(() => {
      // Simulate occasional network errors (5% chance)
      if (Math.random() < 0.05) {
        reject(new Error(`Failed to fetch ${metal.name} price. Please check your connection.`));
        return;
      }

      const prev = _mockPrevPrices[metal.id] ?? metal.basePrice;
      const change = (Math.random() - 0.48) * metal.volatility;
      const price = Math.max(prev + change, metal.basePrice * 0.75);
      _mockPrevPrices[metal.id] = price;

      const prevClose = metal.basePrice + (Math.random() - 0.5) * metal.volatility * 2;
      const prevOpen = metal.basePrice + (Math.random() - 0.5) * metal.volatility * 1.5;

      const now = new Date();

      resolve({
        price: parseFloat(price.toFixed(2)),
        change: parseFloat((price - prevClose).toFixed(2)),
        changePercent: parseFloat(((price - prevClose) / prevClose * 100).toFixed(3)),
        prevClose: parseFloat(prevClose.toFixed(2)),
        prevOpen: parseFloat(prevOpen.toFixed(2)),
        dayHigh: parseFloat((price + Math.random() * metal.volatility).toFixed(2)),
        dayLow: parseFloat((price - Math.random() * metal.volatility * 0.8).toFixed(2)),
        weekHigh: parseFloat((price + Math.random() * metal.volatility * 5).toFixed(2)),
        weekLow: parseFloat((price - Math.random() * metal.volatility * 3).toFixed(2)),
        fetchedAt: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      });
    }, delay);
  });
}

// ---------- Real GoldAPI.io implementation ----------

async function _realFetchMetal(metal) {
  const res = await fetch(`${GOLDAPI_BASE}/${metal.symbol}/USD`, {
    headers: {
      'x-access-token': GOLDAPI_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status} for ${metal.name}`);
  }

  const d = await res.json();
  const now = new Date();

  return {
    price: d.price,
    change: d.ch,
    changePercent: d.chp,
    prevClose: d.prev_close_price,
    prevOpen: d.open_price,
    dayHigh: d.high_price,
    dayLow: d.low_price,
    weekHigh: d['52weekhigh'] ?? d.price,
    weekLow: d['52weeklow'] ?? d.price,
    fetchedAt: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  };
}

// ---------- Public API ----------

/**
 * Fetch a single metal's spot price.
 * @param {object} metal  - one of the METALS array entries
 * @returns {Promise<PriceData>}
 */
export async function fetchMetalPrice(metal) {
  if (USE_MOCK) {
    return _mockFetchMetal(metal);
  }
  return _realFetchMetal(metal);
}

/**
 * Fetch all metals concurrently.
 * Returns an array of { metalId, data?, error? } objects.
 */
export async function fetchAllMetals() {
  const results = await Promise.allSettled(
    METALS.map(m => fetchMetalPrice(m).then(data => ({ metalId: m.id, data })))
  );

  return results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    return { metalId: METALS[i].id, error: r.reason?.message ?? 'Unknown error' };
  });
}
