/**
 * @file stats.ts
 * @description Basic statistical functions.
 */

/**
 * @param arr Array of numbers.
 * @returns Mean of the array. Return 0 if empty.
 */
export function mean(arr: Iterable<number>): number {
  let n = 0;
  let cum = 0;
  for (const x of arr) {
    const co = 1 / ++n;
    cum = (1 - co) * cum + co * x;
  }
  return cum;
}

/**
 * @param arr Array of numbers.
 * @returns Unbiased sample variance of the array. Return 0 if length-0 or 1.
 */
export function variance(arr: Iterable<number>): number {
  let n = 0;
  let cum1 = 0;
  let cum2 = 0;
  for (const x of arr) {
    const co = 1 / ++n;
    cum1 = (1 - co) * cum1 + co * x;
    cum2 = (1 - co) * cum2 + co * x ** 2;
  }
  if (n <= 1) {
    return 0;
  }
  return (cum2 - cum1 ** 2) * (1 + 1 / (n - 1));
}

/**
 * @param arr Array of numbers.
 * @returns Square root of {@link variance}.
 */
export function stddev(arr: Iterable<number>): number {
  return Math.sqrt(variance(arr));
}
