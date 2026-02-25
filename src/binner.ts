/**
 * @file binner.ts
 * @description Binning analyzer for correlated samples.
 */
import { mean, variance } from "./stats.js";

/**
 * Compute pairwise averages.
 * @param arr Input array of numbers.
 * @returns Array of numbers consisting of the averages for all the adjacent element pairs. Unpaired last element is dropped.
 */
function adjMean(arr: Float64Array): Float64Array<ArrayBuffer> {
  const half = Math.floor(arr.length / 2);
  const ret = new Float64Array(half);
  for (let i = 0; i + 1 < arr.length; i += 2) {
    ret[i / 2] = (arr[i] + arr[i + 1]) / 2;
  }
  return ret;
}

/**
 * Binary binner used for estimating standard errors from correlated samples.
 */
export default class BinaryBinner {
  #binned: Float64Array<ArrayBuffer>[];
  #rawMean: number;
  #varCache: Map<number, number>;

  /**
   * @param layer Target layer.
   * @returns Size of the bin for the given layer.
   */
  static binSize(layer: number): number {
    if (layer < 0) {
      const msg = "layer must be non-negative";
      throw new RangeError(msg);
    }
    return 2 ** layer;
  }

  /**
   * Create a new {@link BinaryBinner} from a time series of samples.
   * @param arr Sequence of samples.
   */
  constructor(arr: Iterable<number>) {
    let work = Float64Array.from(arr);
    if (work.length === 0) {
      const msg = "Data sequence must not be empty";
      throw new Error(msg);
    }
    this.#binned = [];
    this.#rawMean = mean(work);
    this.#varCache = new Map();
    while (work.length > 0) {
      this.#binned.push(work);
      work = adjMean(work);
    }
  }

  #getLayer(layer: number): Float64Array<ArrayBuffer> {
    const ret = this.#binned.at(layer);
    if (ret === undefined) {
      const msg = `layer ${layer} out of bounds`;
      throw new RangeError(msg);
    }
    return ret;
  }

  /**
   * @returns Total number of layers.
   */
  get numLayers(): number {
    return this.#binned.length;
  }

  /**
   * @param layer Target layer.
   * @returns Copy of the internal binned data.
   */
  layer(layer: number): number[] {
    return [...this.#getLayer(layer)];
  }

  /**
   * @param layer Target layer.
   * @returns Number of bins in the given layer.
   */
  numBins(layer: number): number {
    return this.#getLayer(layer).length;
  }

  /**
   * @returns Number of samples in total.
   */
  get numSamples(): number {
    return this.numBins(0);
  }

  /**
   * @returns Mean of the original samples.
   */
  get mean(): number {
    return this.#rawMean;
  }

  /**
   * @param layer Target layer. Defaults to 0.
   * @returns Raw variance of the target layer.
   */
  rawVariance(layer = 0): number {
    let val = this.#varCache.get(layer);
    if (val === undefined) {
      val = variance(this.#getLayer(layer));
      this.#varCache.set(layer, val);
    }
    return val;
  }

  /**
   * @param layer Target layer. Defaults to 0.
   * @returns Square root of {@link rawVariance}.
   */
  rawStdDev(layer?: number): number {
    return Math.sqrt(this.rawVariance(layer));
  }

  /**
   * @param layer Target layer. Choose decent values so that both {@link binSize} and {@link numBins} are sufficiently large.
   * @returns Variance estimate. Its asymptotic value gives standard variance of the mean.
   */
  corVariance(layer: number): number {
    return (
      BinaryBinner.binSize(layer) * (this.rawVariance(layer) / this.numSamples)
    );
  }

  /**
   * @param layer Target layer.
   * @returns Square root of {@link corVariance}.
   */
  corStdDev(layer: number): number {
    return Math.sqrt(this.corVariance(layer));
  }

  /**
   * Correlated sample mean variance divided by the uncorrelated counterpart.
   * @param layer Target layer.
   * @returns The ratio. Can be Infinity or NaN if {@link rawVariance} is zero.
   */
  ineff(layer: number): number {
    return (
      BinaryBinner.binSize(layer) *
      (this.rawVariance(layer) / this.rawVariance())
    );
  }

  /**
   * @returns Analysis statistics of the data.
   */
  stat() {
    const cfg = { length: this.numLayers } as const;
    const bins = Array.from(cfg, (_, l) => BinaryBinner.binSize(l));
    const samples = Array.from(cfg, (_, l) => this.numBins(l));
    const stds = Array.from(cfg, (_, l) => this.corStdDev(l));
    const ineffs = Array.from(cfg, (_, l) => this.ineff(l));
    return {
      "total-mean": this.mean,
      "total-std-raw": this.rawStdDev(),
      "bin-width": bins,
      "num-bins": samples,
      "std-binned": stds,
      inefficiency: ineffs,
    };
  }
}
