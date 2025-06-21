/**
 * Binning analysis for correlated samples.
 * @module binner
 */
import { mean, variance } from "./stats.js";

function* pairIter(arr: number[]): Generator<[number, number]> {
  for (let i = 0; i + 1 < arr.length; i += 2) {
    yield [arr[i], arr[i + 1]];
  }
}

/**
 * Binary binner used for estimating standard errors from correlated samples.
 */
export default class BinaryBinner {
  #binned: number[][];
  #rawMean: number;
  #rawVar: number;

  /**
   * Bin size for the given layer.
   */
  static binSize(layer: number): number {
    if (layer < 0) {
      const msg = "layer must be non-negative";
      throw new RangeError(msg);
    }
    return 2 ** layer;
  }

  /**
   * Create a new BinaryBinner from a sequencial samples.
   * @param arr Sequence of samples.
   */
  constructor(arr: number[]) {
    if (arr.length === 0) {
      const msg = "Data sequence must not be empty";
      throw new Error(msg);
    }
    this.#binned = [];
    let work = [...arr];
    while (work.length > 0) {
      this.#binned.push(work);
      const half = [...pairIter(work).map((ab) => mean(ab))];
      work = half;
    }
    this.#rawMean = mean(arr);
    this.#rawVar = variance(arr);
  }

  #getLayer(layer: number): number[] {
    const ret = this.#binned.at(layer);
    if (ret === undefined) {
      const msg = `layer ${layer} out of bounds`;
      throw new RangeError(msg);
    }
    return ret;
  }

  /**
   * Number of binning layers in total.
   */
  get numLayers(): number {
    return this.#binned.length;
  }

  /**
   * Get a copy of binned samples for the given layer.
   */
  layer(layer: number): number[] {
    return [...this.#getLayer(layer)];
  }

  /**
   * Number of bins for the given layer.
   */
  numBins(layer: number): number {
    return this.#getLayer(layer).length;
  }

  /**
   * Total number of samples.
   */
  get numSamples(): number {
    return this.numBins(0);
  }

  /**
   * Mean of the whole samples.
   */
  get mean(): number {
    return this.#rawMean;
  }

  /**
   * Variance of binned samples for the given layer.
   * @param layer Defaults to 0 (whole sample).
   */
  rawVariance(layer?: number): number {
    if (layer === undefined) {
      return this.#rawVar;
    }
    return variance(this.#getLayer(layer));
  }

  /**
   * Square root of {@link rawVariance}.
   */
  rawStdDev(layer?: number): number {
    return Math.sqrt(this.rawVariance(layer));
  }

  /**
   * Variance estimate of sample mean.
   * @param layer Target layer. Choose decent values so that both {@link binSize} and {@link numBins} are sufficiently large.
   * @returns Variance estimate. Its asymptotic value gives standard error of sample mean.
   */
  corVariance(layer: number): number {
    return (
      BinaryBinner.binSize(layer) * (this.rawVariance(layer) / this.numSamples)
    );
  }

  /**
   * Square root of {@link corVariance}.
   */
  corStdDev(layer: number): number {
    return Math.sqrt(this.corVariance(layer));
  }

  /**
   * Correlated sample mean variance divided by uncorrelated counterpart.
   * Results can be NaN of Infinity if total variance is zero.
   */
  ineff(layer: number): number {
    return (
      BinaryBinner.binSize(layer) *
      (this.rawVariance(layer) / this.rawVariance())
    );
  }
}
