# Scalax – Calculating Numerical Scales

[![GitHub License](https://img.shields.io/github/license/komed3/scalax?style=for-the-badge&logo=unlicense&logoColor=fff)](LICENSE)
[![Static Badge](https://img.shields.io/badge/Typescript-support?style=for-the-badge&logo=typescript&logoColor=fff&color=blue)](https://www.typescriptlang.org)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/komed3/scalax?style=for-the-badge&logo=npm&logoColor=fff)](https://npmjs.com/package/scalax)
[![npm bundle size](https://img.shields.io/bundlephobia/min/scalax?style=for-the-badge&logo=gitlfs&logoColor=fff)](https://bundlephobia.com/package/scalax)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/komed3/scalax/build.yml?style=for-the-badge&logo=educative&logoColor=fff)](https://github.com/komed3/scalax/actions/workflows/build.yml)

The `scalax` npm package is a lightweight and extensible TypeScript library for calculating numerical scales. It is designed for use in data visualization, charting, and any context where you need to map values between different numeric domains. The library supports linear, logarithmic, and radial (circular) scales, each with a consistent and intuitive API.

Core features include locating “nice” step values at the same intervals, freely selectable granularity (how close together ticks may be) and the calculation of scales in both directions from zero – particularly useful for logarithmic scales. In addition, the library allows the computation of percentages into scale values and vice versa to facilitate graphical representations for data points.

**This library is the successor to the two npm packages [linscale](https://www.npmjs.com/package/linscale) and [logarscale](https://www.npmjs.com/package/logarscale).**

## Installation

You can install `scalax` via npm:

```sh
npm install scalax
```

Use the package in browser environments via jsDelivr:

```html
<script type="module">
  import { Scale } from 'https://cdn.jsdelivr.net/npm/scalax@1.0.1/+esm';
  const scale = new Scale.linear( … );
</script>
```

## Quick Start

Here is a minimal example of how to use `scalax` to create a logarithmic scale and retrieve tick values:

```typescript
import { Scale } from 'scalax';

// Create a logarithmic scale from -9 to 953 with up to 10 ticks and base 10
const scale = new Scale.logarithmic( -9, 953, 10, 0.01, 10 ).run();

console.log( scale.getTicks() ); // [ -10, -1, -0.1, 0, 0.1, 1, 10, 100, 1000 ]
console.log( scale.getPointAt( 0.5 ) ); // Value at 50% along the scale
console.log( scale.getPct( 10 ) ); // Percentage position of value 10 on the scale
```

## Scale Types

`scalax` comes with three main scale types, each suited for different use cases:

- **Linear scale**: Maps values evenly between a lower and upper bound. Useful for standard numeric axes.
- **Logarithmic scale**: Maps values logarithmically, supporting both positive and negative domains as well as zero-crossing. Ideal for data spanning several orders of magnitude.
- **Radial scale**: Designed for circular or angular data, such as degrees in a circle or arc segments. Handles wrap-around and arbitrary angular ranges.

Each scale type is available via the `Scale` export:

```typescript
import { Scale } from 'scalax';

const linear = new Scale.linear( … );
const logarithmic = new Scale.logarithmic( … );
const radial = new Scale.radial( … );
```

## Common API

All scale classes share a consistent set of methods and options, inherited form the abstract base class `Scale`.

### Constructor

Each scale can be constructed with the following parameters:

- `low` (number): The lower bound of the scale.
- `high` (number): The upper bound of the scale.
- `maxTicks` (number): The maximum number of ticks to generate.
- `precision` (number, optional): The minimum step size or granularity (not used for radial scales).
- `base` (number, only for logarithmic scales): The logarithmic base (e.g., 10 for decades).

### `setBounds( low, high ), setMaxTicks( maxTicks ), setPrecision( precision )`

Allows you to set / update the bounds, maximum ticks, or precision after construction. These methods return the scale instance for chaining.

### `centerAt( value = 0 )`

Allows you to centers the scale around a given value. The lower and upper bounds will be adjusted to be equidistant from this value.

### `run()`

After setting up the scale, call `run()` to compute all internal values and ticks. This method must be called before using most other methods.

### `getBounds(), getMaxTicks(), getPrecision()`

Returns the current lower and upper bounds, the maximum number of ticks and the precision for the scale.

### `isReady()`

Returns `true` if the scale has been computed and is ready for use.

### `isNegative(), crossesZero()`

Checks if the scale is entirely negative or crosses the zero point.

### `getMinimum(), getMaximum(), getExtrema()`

Returns the minimum, maximum, or both extrema of the scale after computation.

### `getStepSize()`

Returns the computed step size between ticks.  
**Note:** This will stay `undefined` for logarithmic scales.

### `getTickAmount()`

Returns the number of ticks generated for the scale.

### `getRange()`

Returns the numeric range (`max - min`) of the scale.

### `getTicks(), getTicksReverse()`

Returning arrays of tick values (`min` to `max` or in reversed order) computed for the scale, suitable for axis labeling or grid lines.

### `getPointAt( pct )`

Given a percentage (between `0` and `1`, or `0` and `100`), returns the corresponding value on the scale. For example, `getPointAt( 0.5 )` returns the value halfway along the scale.

### `getPct( value, ref = 'min' )`

Given a value within the scale's range, returns its relative position as a percentage (between `0` and `1`). The optional `ref` parameter can be `min` or `max` to specify the reference direction.

## Scale-Specific Features

### Logarithmic scale

- Supports both positive and negative domains, as well as zero-crossing.
- The `base` parameter allows you to set the logarithmic base (e.g., `2`, `10`, `e`).
- Ticks are always exact powers of the base, and `0` is included if the scale crosses zero.
- Methods: `setBase( base )`, `getBase()` to set and get the logarithmic base.

### Linear scale

- Standard linear mapping and tick generation.
- Precision controls the minimum step size between ticks.

### Radial scale

- Designed for angular data (degrees).
- Handles full circles and arbitrary arc segments.
- Ensures correct wrap-around and tick placement for circular charts.
- The minimal granularity is `1` to return nicely calculated values.

## Example: Creating and Using a Scale

```typescript
import { Scale } from 'scalax';

// Linear scale from 3 to 99 with max. 10 ticks
const linear = new Scale.linear( 3, 99, 10 ).run();
console.log( linear.getTicks() ); // [ 0, 20, 40, 60, 80, 100 ]
console.log( linear.getPointAt( 0.25 ) ); // 25

// Logarithmic scale from -56 to 186 with the base 2
const log = new Scale.logarithmic( -56, 186, 8, 2, 2 ).run();
console.log( log.getTicks() ); // [ -64, -32, 0, 32, 64, 128, 256 ]
console.log( log.getPct( 10 ) ); // 0.495...

// Radial scale for a half-circle ( 0 to 180 degrees ) with 5 ticks
const radial = new Scale.radial( 0, 180, 5 ).run();
console.log( radial.getTicks() ); // [ 0, 45, 90, 135, 180 ]
```

_Try with [OneCompiler](https://onecompiler.com/nodejs/43nh9mk6n)_
