# 🗂️ binning: Correlated data analyzer written in TypeScript

[![npm version](https://badge.fury.io/js/binning.svg)](https://badge.fury.io/js/binning)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚸 Binning Basics

Suppose you have a sequence of numbers drawn from a distribution:

```jsonc
// data.json (snipped)
[0.30471707975443135, -1.0399841062404955, ..., -0.18284989730929277]
```

Binning helps you with estimating the mean of the distribution, _without_ assuming that the data are uncorrelated.

To begin with, install `npm` and run this package via `npx`:

```bash
$ npx binning -i data.json
{
  // Snipped output
  "total-mean": -0.010249875414011674,
  "total-std-raw": 1.0063360865993558,
  "bin-width": [1, 2, ..., 8192],
  "num-bins": [10000, 5000, ..., 1],
  "std-binned": [0.010063360865993558, 0.010150159104417545, ..., 0],
  "inefficiency": [1, 1.0173247416124989, 1.00605900827216, ..., 0]
}
```

Output is a stringified JSON object with the following fields:

- `total-mean` ❗️IMPORTANT❗️

Mean of the whole data.
This gives an unbiased estimate of the mean of the distribution.

- `total-std-raw`

Standard deviation of the whole data.

- `bin-width`

Used chunk sizes: the data are divided into non-overlapping subarrays of these sizes during the analysis.

- `num-bins`

Number of bins for each `bin-width`.
Note that `bin-width` times `num-bins` can be different from the original length as reminder data are discarded.

- `std-binned` ❗️IMPORTANT❗️

Binned standard deviation.
In the limit of large `bin-width` and `num-bins`, this gives the standard error of `total-mean` .

- `inefficiency`

Correlated variance estimate divided by the uncorrelated counterpart.

In the above example, as `std-binned` are approximately equal to 0.01 for large `bin-width` and `num-bins`, we get `-0.01(1)` as the final estimate.

## 🔨 Usage

See `npx binning -h` for the full list of options.

### 1D Data

```bash
# Read JSON from stdin
echo "[1, 2, 3]" | npx binning
# Read CSV from stdin
echo "1,2,3" | npx binning
# Read space-separated numbers from stdin
echo "1 2 3" | npx binning
```

### 2D Data

```bash
# Analyze the column 1 of JSON
echo "[[1,2,3],[4,5,6]]" | npx binning -c 1
# Analyze the row 0 of CSV
echo -e "1,2,3\n4,5,6" | npx binning -r 0
```

### File IO

```bash
# Read from input.json and write to output.json
npx binning -i input.json -o output.json
```

### 🦕 Running from Deno

```bash
echo "1 2 3" | deno run -r -A npm:binning
```

## ☑ Notes

- You can use `#` as a comment char.
- If data are essentially 1D, you can omit `-c` and `-r`.
- `-c` and `-r` cannot be used together.

## 💡 Reference

J. Gubernatis, N. Kawashima, and P. Werner, [Quantum Monte Carlo Methods](https://www.cambridge.org/core/books/quantum-monte-carlo-methods/AEA92390DA497360EEDA153CF1CEC7AC)

## 📄 License

MIT
