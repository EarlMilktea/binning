/**
 * @file stats.ts
 * @description Basic statistical functions.
 */

/**
 * Simple arithmetic mean.
 * Returns 0 if empty.
 * @param arr - Array of numbers.
 */
export function mean(arr: readonly number[]): number {
  const n = arr.length;
  if (n === 0) {
    return 0;
  }
  return arr.reduce((l, r) => l + r) / n;
}

/**
 * Unbiased sample standard deviation.
 * Returns 0 for length-zero or one arrays.
 * @param arr - Array of numbers.
 */
export function variance(arr: readonly number[]): number {
  const n = arr.length;
  if (n <= 1) {
    return 0;
  }
  const m = mean(arr);
  let cum = 0;
  for (const x of arr) {
    cum += (x - m) ** 2;
  }
  return cum / (n - 1);
}

/**
 * Square root of {@link variance}.
 * @param arr - Array of numbers.
 */
export function stddev(arr: readonly number[]): number {
  return Math.sqrt(variance(arr));
}
