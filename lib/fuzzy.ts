/** Tiny zero-dep fuzzy scorer for the command palette. */
export function fuzzyScore(query: string, label: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1; // empty query matches everything
  const l = label.toLowerCase();

  if (l.startsWith(q)) return 4;
  if (l.split(/\s+/).some((w) => w.startsWith(q))) return 3;
  if (l.includes(q)) return 2;

  // in-order subsequence ("wknt" → "wayne kinetic notes")
  let i = 0;
  for (const ch of l) {
    if (ch === q[i]) i++;
    if (i === q.length) return 0.5;
  }
  return 0;
}

export function fuzzyFilter<T>(
  query: string,
  items: T[],
  label: (item: T) => string,
): T[] {
  return items
    .map((item, order) => ({ item, order, score: fuzzyScore(query, label(item)) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((r) => r.item);
}
