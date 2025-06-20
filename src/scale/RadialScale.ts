/**
 * Radial Scale
 * src/scale/RadialScale.ts
 * 
 * This module defines the `RadialScale` class that extends the `Scale` class.
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

import { Scale } from './Scale.js';

/**
 * Represents a radial scale for for circular or arc-based charts.
 * This scale computes tick values and step sizes based on the provided bounds,
 * maximum ticks, and precision. It ensures correct handling of circular
 * wrap-around and supports arbitrary arc segments.
 *
 * @extends Scale
 */
export class RadialScale extends Scale {

    /**
     * Creates a new RadialScale instance.
     * 
     * @param {number} [maxTicks] - The maximum number of ticks on the scale
     * @param {number} [precision] - The precision for the scale calculations
     * @param {number} [low=0] - The starting angle (in degrees)
     * @param {number} [high=360] - The ending angle (in degrees)
     */
    constructor ( maxTicks?: number, precision?: number, low: number = 0, high: number = 360 ) {

        low = Number ( low ), high = Number ( high );

        // Normalize bounds first (0-360)
        const lower = low % 360;
        const upper = high % 360 + ( high % 360 < lower ? 360 : 0 );

        // Call the parent constructor with the provided parameters
        super ( lower, upper, maxTicks, precision );

    }

    /**
     * Returns the nearest `nice` angular value to the given value.
     *
     * @param {number} value - The value to round
     * @returns {number} The nearest angular value
     */
    private _nearest ( value: number ) : number {

        // Special handling for radial scales (degrees)
        const commonDegrees: number[] = [ 0, 1, 2, 5, 10, 15, 30, 45, 60, 90, 120, 180, 360 ];

        // Find the closest common degree value
        let nearest: number = commonDegrees[ 0 ];
        let minDiff: number = Math.abs( value - nearest );

        for ( const degree of commonDegrees ) {

            const diff: number = Math.abs( value - degree );

            if ( diff < minDiff ) minDiff = diff, nearest = degree;
            else if ( diff === minDiff ) nearest = degree;

        }

        return nearest;

    }

    /**
     * Computes the angular scale properties based on the provided bounds and precision.
     *
     * @returns {boolean} True if the scale was successfully computed, false otherwise
     */
    protected override compute () : boolean {

        if (
            this.precision !== undefined &&
            this.lowerBound !== undefined &&
            this.upperBound !== undefined &&
            this.maxTicks !== undefined
        ) {

            // Calculate the "nice" range (always including 0 for full circles)
            let niceRange = Math.min( this.upperBound - this.lowerBound, 360 );

            // Find a nice step size (angular)
            this.stepSize = this._nearest( niceRange / ( this.maxTicks - 1 ) );

            // Ensure stepSize is at least precision
            this.stepSize = Math.max( this.stepSize, this.precision );

            do {

                // For radial scales, we typically want to start from 0 (or multiple of stepSize)
                this.min = Math.floor( this.lowerBound / this.stepSize ) * this.stepSize;
                this.max = Math.ceil( this.upperBound / this.stepSize ) * this.stepSize;

                // Special case: if range is ~360, make it exactly 0-360
                if ( this.max - this.min >= 355 ) this.min = 0, this.max = 360;

                this.range = this.max - this.min;
                this.tickAmount = Math.round( this.range / this.stepSize ) + 1;

                if ( this.tickAmount <= this.maxTicks ) return true;

                // If too many ticks, find the next nice angular step size
                const nextSteps = [ 15, 30, 45, 60, 90, 120, 180, 360 ];
                const currentIndex = nextSteps.indexOf( this.stepSize );

                this.stepSize = currentIndex < nextSteps.length - 1 
                    ? nextSteps[ currentIndex + 1 ] 
                    : 360;

            } while ( true );

        }

        return false;

    }

}