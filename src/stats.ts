/**
 * @file stats.ts
 * @description Basic statistical functions.
 */

/**
 * @param arr Array of numbers.
 * @returns Mean of the array. Return 0 if empty.
 */
export function mean(arr: readonly number[]): number {
  const n = arr.length;
  if (n === 0) {
    return 0;
  }
  return arr.reduce((l, r) => l + r) / n;
}

/**
 * @param arr Array of numbers.
 * @returns Unbiased sample variance of the array. Return 0 if length-0 or 1.
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
 * @param arr Array of numbers.
 * @returns Square root of {@link variance}.
 */
export function stddev(arr: readonly number[]): number {
  return Math.sqrt(variance(arr));
}
