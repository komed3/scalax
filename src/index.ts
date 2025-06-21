/**
 * scalax - Scale Utility Library
 * 
 * This module serves as the main entry point for the scalax library, providing
 * unified access to various scale classes for numerical data transformation and
 * visualization.
 * 
 * The scalax library offers flexible and extensible scale types, including:
 * 
 * - LinearScale:      For evenly spaced, linear numeric scales.
 * - LogarithmicScale: For logarithmic scales, useful for data spanning several
 *                     orders of magnitude.
 * - RadialScale:      For circular or angular scales, such as those used in
 *                     polar charts.
 * 
 * Each scale type supports configuration of bounds, tick calculation, precision,
 * and other features required for charting, plotting, or data normalization.
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 * @version 1.0.0
 */

'use strict';

import { LinearScale } from './scale/LinearScale.js';
import { LogarithmicScale } from './scale/LogarithmicScale.js';
import { RadialScale } from './scale/RadialScale.js';

export const Scale = {
    linear: LinearScale,
    logarithmic: LogarithmicScale,
    radial: RadialScale
}