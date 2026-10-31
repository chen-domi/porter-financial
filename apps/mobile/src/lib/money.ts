const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Split integer cents into a whole-dollar string and a two-digit cents string. */
export function splitCents(cents: number): { whole: string; cents: string } {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(Math.trunc(cents));
  return {
    whole: sign + dollars.format(Math.floor(abs / 100)),
    cents: String(abs % 100).padStart(2, '0'),
  };
}
