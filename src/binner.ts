/**
 * Binning analysis for correlated samples.
 * @module binner
 */
import { mean, stddev, variance } from "./stats.js";

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
   * Create a new BinaryBinner from a sequencial samples.
   * @param arr Sequence of samples.
   */
  constructor(arr: number[]) {
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
      throw new Error(msg);
    }
    return ret;
  }

  /**
   * Number of binning layers.
   */
  get numLayers(): number {
    return this.#binned.length;
  }

  /**
   * Size of the bin for the given layer.
   * @param layer Defaults to 0.
   */
  binSize(layer: number = 0): number {
    const _ = this.#getLayer(layer);
    if (layer < 0) {
      layer += this.numLayers;
    }
    return 2 ** layer;
  }

  /**
   * Number of bins for the given layer.
   * @param layer Defaults to 0.
   */
  numBins(layer: number = 0): number {
    return this.#getLayer(layer).length;
  }

  /**
   * Get a copy of the binned samples for the given layer.
   */
  layer(layer: number): number[] {
    return [...this.#getLayer(layer)];
  }

  /**
   * Mean of the whole samples.
   */
  mean(): number {
    return this.#rawMean;
  }

  /**
   * Variance of the binned samples for the given layer.
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
    if (layer === undefined) {
      return Math.sqrt(this.#rawVar);
    }
    return stddev(this.#getLayer(layer));
  }

  /**
   * Variance estimate of sample mean.
   * @param layer Target layer. Choose decent values so that both {@link binSize} and {@link numBins} are sufficiently large.
   * @returns Variance estimate. Its asymptotic value gives the standard error of the sample mean.
   */
  corVariance(layer: number): number {
    return (this.binSize(layer) * this.rawVariance(layer)) / this.rawVariance();
  }

  /**
   * Square root of {@link corVariance}.
   */
  corStdDev(layer: number): number {
    return Math.sqrt(this.corVariance(layer));
  }
}
