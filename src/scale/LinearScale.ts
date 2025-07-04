/**
 * Linear Scale
 * src/scale/LinearScale.ts
 * 
 * This module defines the `LinearScale` class that extends the `Scale` class.
 * 
 * The LinearScale is used to create a linear scale between a lower and upper bound,
 * allowing for the computation of tick values, step sizes, and points based on a
 * specified range, maximum ticks, and precision.
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import { Scale } from './Scale.js';

/**
 * Represents a linear scale for numerical values.
 * This scale computes tick values and step sizes based on the provided bounds,
 * maximum ticks, and precision.
 *
 * @extends Scale
 */
export class LinearScale extends Scale {

    /**
     * Creates a new LinearScale instance.
     *
     * @param {number} [low] - The lower bound of the scale
     * @param {number} [high] - The upper bound of the scale
     * @param {number} [maxTicks] - The maximum number of ticks on the scale
     * @param {number} [precision] - The precision for the scale calculations
     */
    constructor ( low?: number, high?: number, maxTicks?: number, precision?: number ) {

        // Call the parent constructor with the provided parameters
        super ( low, high, maxTicks, precision );

    }

    /**
     * Returns the nearest `nice` value to the given value based on the specified rounding.
     *
     * @param {number} value - The value to round
     * @param {boolean} round - Whether to round or floor the value
     * @returns {number} The nearest value
     */
    protected _nearest ( value: number, round: boolean ) : number {

        const exp: number = Math.floor( Math.log10( value ) );
        const val: number = value / Math.pow( 10, exp );

        let nearest: number = 0;

        for ( const [ near, test ] of Object.entries( [
            { 1: 1.0, 2: 2, 5: 5, 10: 10 },
            { 1: 1.5, 2: 3, 5: 7, 10: 10 }
        ][ round ? 1 : 0 ] ) ) {

            if ( round ? val < test : val <= test ) {

                nearest = Number ( near );
                break;

            }

        }

        return nearest * Math.pow( 10, exp );

    }

    /**
     * Returns the next "nice" factor (2, 2.5, or 2) for the given step size.
     * 
     * @param {number} step - The current step size
     * @returns {number} The factor to multiply with
     */
    protected _nextNiceFactor ( step: number ) : number {

        const exp: number = Math.floor( Math.log10( step ) );
        const val: number = step / Math.pow( 10, exp );

        if ( val < 1.5 ) return 2 / val;
        else if ( val < 3.5 ) return 5 / val;
        else return 10 / val;

    }

    /**
     * Computes the tick values for the scale.
     *
     * @returns {number[]} An array of tick values
     */
    protected _ticks ( ticks: number, stepSize: number, min: number ) : number[] {

        return Array.from( { length: ticks }, ( _, i ) => min + ( i * stepSize ) );

    }

    /**
     * Computes the scale properties based on the provided bounds and precision.
     *
     * @returns {boolean} True if the scale was successfully computed, false otherwise
     */
    protected override compute() : boolean {

        if (
            this.precision !== undefined &&
            this.lowerBound !== undefined &&
            this.upperBound !== undefined &&
            this.maxTicks !== undefined
        ) {

            // Calculate the "nice" range
            const range: number = this._nearest(
                this.upperBound - this.lowerBound, false
            );

            // Find a nice step size (linear)
            this.stepSize = Math.max(
                this._nearest( range / ( this.maxTicks - 1 ), true ),
                this.precision
            );

            let attempts: number = 0;

            do {

                // Keep the boundaries within the scales extrema
                this.min = Math.floor( this.lowerBound / this.stepSize ) * this.stepSize;
                this.max = Math.ceil( this.upperBound / this.stepSize ) * this.stepSize;
                this.range = this.max - this.min;

                // Calculate the final tick amount
                this.tickAmount = Math.round( this.range / this.stepSize ) + 1;

                // If this fits the requirements, break
                if ( this.tickAmount <= this.maxTicks ) break;

                // If not, try with a bigger step size
                this.stepSize = this.stepSize * this._nextNiceFactor( this.stepSize );

            } while ( ++attempts < 100 );

            // To many attempts, scale calculation failed
            if ( attempts === 100 ) throw new Error (
                `The scale was unable to be calculated, try to allow more ticks`
            );

            // Computes the tick values
            this.ticks = this._ticks( this.tickAmount, this.stepSize, this.min );

            return true;

        }

        return false;

    }

    /**
     * Computes the point on the scale for a given percentage.
     *
     * @param {number} pct - The percentage (0 to 1) to compute the point for
     * @returns {number} The computed point on the scale
     * @throws {Error} If the percentage is not between 0 and 100
     */
    protected override computePoint ( pct: number ) : number {

        if ( pct < 0 || pct > 100 ) throw new Error (
            `Given value <${pct}> is not a correct percentage, use a number ` +
            `between <0> and <1> or <0> and <100>`
        );

        return ( this.range! * ( pct > 1 ? pct / 100 : pct ) ) + this.min!;

    }

    /**
     * Computes the percentage for a given value based on the scale's min and max.
     *
     * @param {number} value - The value to compute the percentage for
     * @param {'min' | 'max'} ref - Reference point for percentage calculation
     * @returns {number} The computed percentage (0 to 1)
     * @throws {Error} If the value is outside the scale's range
     */
    protected override computePct ( value: number, ref: 'min' | 'max' ) : number {

        if ( value < this.min! || value > this.max! ) throw new Error (
            `Point <${value}> is outside the range <${this.min}, ${this.max}>`
        );

        const pct: number = ( value - this.min! ) / this.range!;

        return ref === 'max' ? 1 - pct : pct;

    }

}