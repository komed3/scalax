/**
 * Radial Scale
 * src/scale/RadialScale.ts
 * 
 * This module defines the `RadialScale` class, which extends the
 * `LinearScale` class.
 * 
 * The RadialScale is used to create circular or angular scales, supporting
 * both full circles (0–360°) and arbitrary arc segments (e.g., 90–270°).
 * It computes tick values, step sizes, and points based on the specified
 * angular range, maximum ticks, and precision.
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import { LinearScale } from './LinearScale.js';

/**
 * Represents a radial (angular) scale for circular or arc-based charts.
 * Inherits all tick and step logic from LinearScale, but ensures correct
 * handling of circular wrap-around and supports arbitrary arc segments.
 *
 * @extends LinearScale
 */
export class RadialScale extends LinearScale {

    /**
     * Creates a new RadialScale instance.
     * 
     * @param {number} [maxTicks] - The maximum number of ticks on the scale
     * @param {number} [precision] - The precision for the scale calculations
     * @param {number} [low=0] - The starting angle (in degrees)
     * @param {number} [high=360] - The ending angle (in degrees)
     */
    constructor ( maxTicks?: number, precision?: number, low: number = 0, high: number = 360 ) {

        // Normalize low and high values to the range [0, 360)
        let lower = ( ( low % 360 ) + 360 ) % 360;
        let upper = ( ( high % 360 ) + 360 ) % 360;

        // If full circle or high < low, treat as wrap-around (e.g., 350–30°)
        // For full circle, use 0–360 for correct tick calculation
        if ( lower === upper ) lower = 0, upper = 360;
        else if ( upper < lower ) upper = upper + 360;

        // Call the parent constructor with the provided parameters
        super ( lower, upper, maxTicks, precision );

    }

}