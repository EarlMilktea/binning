/**
 * Basic statistical functions.
 * @module stats
 */

function addReducer(lhs: number, rhs: number): number {
  return lhs + rhs;
}

/**
 * Simple arithmetic mean.
 *
 * @param arr - Array of numbers.
 */
export function mean(arr: number[]): number {
  const n = arr.length;
  if (n === 0) {
    return 0;
  }
  return arr.reduce(addReducer) / n;
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
  return arr.map((a) => (a - m) ** 2).reduce(addReducer) / (n - 1);
}

/**
 * Square root of {@link variance}.
 *
 * @param arr - Array of numbers.
 */
export function stddev(arr: number[]): number {
  return Math.sqrt(variance(arr));
}
