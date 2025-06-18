/**
 * Basic statistical functions.
 * @module stats
 */

/**
 * Simple arithmetic mean.
 * Returns 0 if empty.
 *
 * @param arr - Array of numbers.
 */
export function mean(arr: number[]): number {
  const n = arr.length;
  if (n === 0) {
    return 0;
  }
  return arr.reduce((l, r) => l + r) / n;
}

/**
 * Unbiased sample standard deviation.
 * Returns 0 for length-zero or one arrays.
 *
 * @param arr - Array of numbers.
 */
export function variance(arr: number[]): number {
  const n = arr.length;
  if (n <= 1) {
    return 0;
  }
  const m = mean(arr);
  const it = arr[Symbol.iterator]();
  return it.map((x) => (x - m) ** 2).reduce((l, r) => l + r) / (n - 1);
}

/**
 * Square root of {@link variance}.
 *
 * @param arr - Array of numbers.
 */
export function stddev(arr: number[]): number {
  return Math.sqrt(variance(arr));
}
