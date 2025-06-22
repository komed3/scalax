/**
 * Logarithmic Scale
 * src/scale/LogarithmicScale.ts
 * 
 * This module defines the `LogarithmicScale` class that extends the `Scale` class.
 * 
 * The LogarithmicScale is used to create a logarithmic scale between a lower and
 * upper bound, allowing for the computation of tick values, step sizes, and points
 * based on a specified range, maximum ticks, and base.
 * 
 * Supports negative, positive, and zero-crossing ranges, and computes all values
 * logarithmically with respect to the chosen base.
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import { Scale } from './Scale.js';

/**
 * Represents a logarithmic scale for numerical values.
 * This scale computes tick values and step sizes based on the provided bounds,
 * maximum ticks, precision, and base.
 *
 * @extends Scale
 */
export class LogarithmicScale extends Scale {

    // Logarithmic base, default is `10`
    protected base: number = 10;

    /**
     * Creates a new LogarithmicScale instance.
     * 
     * @param {number} [low] - The lower bound of the scale
     * @param {number} [high] - The upper bound of the scale
     * @param {number} [maxTicks] - The maximum number of ticks on the scale
     * @param {number} [precision] - The precision for the scale calculations
     * @param {number} [base] - The logarithmic base
     */
    constructor ( low?: number, high?: number, maxTicks?: number, precision?: number, base?: number ) {

        // Call the parent constructor with the provided parameters
        super ( low, high, maxTicks, precision );

        // Set the logarithmic base, if provided
        if ( base !== undefined ) this.setBase( base );

    }

    /**
     * Returns the logarithm of the absolute value with respect to the scale's base.
     * 
     * @param {number} value - The value to compute the logarithm for
     * @returns {number} The logarithm of the absolute value
     */
    protected _base ( value: number ) : number {

        return Math.log( Math.abs( value ) ) / Math.log( this.base );

    }

    /**
     * Wraps the lower and upper bounds to the nearest powers of the base,
     * respecting precision.
     * 
     * @param {number} lower - The lower bound
     * @param {number} upper - The upper bound
     * @param {number} precision - The precision for the scale
     * @returns {[number, number]} The wrapped [min, max] bounds
     */
    protected _wrap ( lower: number, upper: number, precision: number ) : [ number, number ] {

        // Calculate the exponent for the precision
        const expPrec: number = Math.round( this._base( precision ) );

        // Bound function to calculate the nearest power of the base
        const bound = ( v: number, dir: 'floor' | 'ceil' ) => Math.pow(
            this.base, Math.max( expPrec, Math[ dir ]( this._base( v ) ) )
        );

        // Calculate the minimum and maximum bounds
        const min: number = lower < 0 ? -bound( lower, 'ceil' ) : lower > 0 ?  bound( lower, 'floor' ) : 0;
        const max: number = upper > 0 ?  bound( upper, 'ceil' ) : upper < 0 ? -bound( upper, 'floor' ) : 0;

        return [ min, max ];

    }

    /**
     * Computes the raw tick values for the logarithmic scale.
     * 
     * @param {number} lower - The lower bound
     * @param {number} upper - The upper bound
     * @param {number} precision - The precision for the scale
     * @returns {number[]} An array of tick values
     */
    protected _rawTicks ( lower: number, upper: number, precision: number ) : number[] {

        const [ min, max ] = this._wrap( lower, upper, precision );
        const expMin: number = Math.round( this._base( precision ) );
        const ticks: Set<number> = new Set ();

        // Helper function to add ticks in a range
        const addRange = ( sign: 1 | -1, toExp: number ) : void => {

            for ( let e: number = expMin; e <= toExp; e++ ) {

                const tick: number = sign * Math.pow( this.base, e );

                if ( tick >= min && tick <= max ) ticks.add( tick );

            }

        };

        // Add ticks for the negative range
        if ( min < 0 ) addRange( -1, Math.round( this._base( -min ) ) );

        // Add `zero` tick for zero-crossing ranges
        if ( lower <= 0 && upper >= 0 || (
            Math.min( Math.abs( lower ), Math.abs( upper ) ) < precision
        ) ) ticks.add( 0 );

        // Add ticks for the positive range
        if ( max > 0 ) addRange( 1, Math.round( this._base( max ) ) );

        // Convert the set to an array and sort it
        return Array.from( ticks ).sort( ( a, b ) => a - b );

    }

    /**
     * Prunes the tick values to fit within the maximum allowed number of ticks.
     * 
     * @param {number} lower - The lower bound
     * @param {number} upper - The upper bound
     * @param {number} precision - The precision for the scale
     * @param {number} maxTicks - The maximum number of ticks
     * @returns {number[]} An array of pruned tick values
     * @throws {Error} If unable to reduce tick count to fit maxTicks
     */
    protected _prune ( lower: number, upper: number, precision: number, maxTicks: number ) : number[] {

        let prec: number = precision, attempts: number = 0, ticks: number[];

        do {

            // Get the raw ticks based on the current precision
            ticks = this._rawTicks( lower, upper, prec );

            // If the tick count is within the maximum, return the ticks
            if ( ticks.length <= maxTicks ) return ticks;

            // If the tick count exceeds the maximum, increase precision
            prec = Math.pow( this.base, Math.round( this._base( prec ) + 1 ) );
            attempts++;

        } while ( attempts < 100 );

        throw new Error(
            `Unable to reduce tick count to fit maximum allowed ticks <${maxTicks}>`
        );

    }

    /**
     * Computes the scale properties and tick values for the logarithmic scale.
     * 
     * @returns {boolean} True if the scale was successfully computed, false otherwise
     */
    protected override compute () : boolean {

        if (
            this.precision !== undefined &&
            this.lowerBound !== undefined &&
            this.upperBound !== undefined &&
            this.maxTicks !== undefined &&
            this.base !== undefined
        ) {

            // Computes the tick values
            this.ticks = this._prune(
                this.lowerBound, this.upperBound,
                this.precision, this.maxTicks
            );

            // Calculate the tick amount
            this.tickAmount = this.ticks.length;

            // Calculate the extreme and range
            this.min = this.ticks[ 0 ];
            this.max = this.ticks[ this.tickAmount - 1 ];
            this.range = this.max - this.min;

            return true;

        }

        return false;

    }

    /**
     * Computes the point on the scale for a given percentage.
     * 
     * @param {number} pct - The percentage (0 to 1 or 0 to 100)
     * @returns {number} The computed point on the scale
     * @throws {Error} If the percentage is not between 0 and 100
     */
    protected override computePoint ( pct: number ) : number {

        const { ticks = [], base } = this;
        const p: number = pct > 1 ? pct / 100 : pct;
        const n: number = ticks.length;
        const zeroIndex: number = ticks.indexOf( 0 );

        if ( p < 0 || p > 1 ) throw new Error(
            `Given value <${pct}> is not a correct percentage, use a number ` +
            `between <0> and <1> or <0> and <100>`
        );

        // Calculate the positions of the ticks in the range [0, 1]
        const positions: number[] = ticks.map( ( _, i ) => i / ( n - 1 ) );

        // If the value references the zero tick, return it directly
        if ( zeroIndex !== -1 && p === positions[ zeroIndex ] ) return 0;

        // Find the interval where the percentage lies
        let i0: number = positions.findIndex(
            ( pos, i ) => i < n - 1 && p >= pos && p <= positions[ i + 1 ]
        );

        // If no interval was found, handle edge cases
        if ( i0 === -1 ) {

            // If the percentage is at or below 0, return the first tick
            if ( p <= 0 ) return ticks[ 0 ];

            // If the percentage is at or above 1, return the last tick
            if ( p >= 1 ) return ticks[ n - 1 ];

            // If zero tick exists, determine if p is before or after zero
            if ( zeroIndex !== -1 ) p < positions[ zeroIndex ]
                ? ticks[ Math.max( 0, zeroIndex - 1 ) ]
                : ticks[ Math.min( n - 1, zeroIndex + 1 ) ];

            // Default to the first tick if no zero tick is present
            return ticks[ 0 ];

        }

        // If we found an interval, calculate the point based on logarithmic interpolation
        const [ a, b ] = [ ticks[ i0 ], ticks[ i0 + 1 ] ], [ pa, pb ] = [ positions[ i0 ], positions[ i0 + 1 ] ];
        const t: number = Math.abs( pb - pa ) < 1e-15 ? 0 : ( p - pa ) / ( pb - pa );
        const sign: number = a < 0 && b < 0 ? -1 : 1;

        // Logarithm and exponentiation functions with respect to the base
        const log = ( x: number ) : number => Math.log( Math.abs( x ) + Number.EPSILON ) / Math.log( base );
        const exp = ( v: number ) : number => Math.pow( base, v ) - Number.EPSILON;

        // Calculate the point using logarithmic interpolation
        return Number ( ( sign * exp( log( a ) + t * ( log( b ) - log( a ) ) ) ).toFixed( 9 ) );

    }

    /**
     * Computes the percentage for a given value based on the scale's
     * min and max (logarithmic).
     * 
     * @param {number} value - The value to compute the percentage for
     * @param {'min' | 'max'} ref - Reference point for percentage calculation
     * @returns {number} The computed percentage (0 to 1)
     * @throws {Error} If the value is outside the scale's range
     */
    protected override computePct ( value: number, ref: 'min' | 'max' ) : number {

        const { ticks = [], base, min = 0, max = 0 } = this;
        const n: number = ticks.length;
        const zeroIndex: number = ticks.indexOf( 0 );

        if ( value < min || value > max ) throw new Error (
            `Point <${value}> is outside the range <${min}, ${max}>`
        );

        // Return the zero point exactly
        if ( zeroIndex !== -1 && value === 0 ) return Math.abs(
            ( ref === 'max' ? 1 : 0 ) - zeroIndex / ( n - 1 )
        );

        // Calculate the delta for logarithm to avoid log(0)
        const delta: number = Number.EPSILON;

        // Calculate the positions of the ticks in the range [0, 1]
        const positions: number[] = ticks.map( ( _, i ) => i / ( n - 1 ) );

        // Logarithm function with respect to the base
        const log = ( v: number ) : number => (
            Math.log( Math.abs( v ) + delta ) / Math.log( base )
        );

        // Find the intervall where the value lies
        // i0 is the index of the first tick that is less than or equal to value
        const i0: number = ticks.findIndex( ( t, i ) => (
            i < n - 1 && value >= t && value <= ticks[ i + 1 ]
        ) );

        let pos: number;

        // If no intervall was found, we are either below the first tick or above the last
        if ( i0 === -1 ) {

            // If the value is below the first tick, we are at the start
            if ( value <= ticks[ 0 ] ) pos = 0;

            // If the value is above the last tick, we are at the end
            else if ( value >= ticks[ n - 1 ] ) pos = 1;

            // If the value is between the first and last tick, we need to find the closest tick
            else if ( zeroIndex !== -1 ) pos = value < 0
                ? positions[ Math.max( 0, zeroIndex - 1 ) ]
                : positions[ Math.min( n - 1, zeroIndex + 1 ) ];

            // If no zero tick is present, we assume the value is positive and between
            // the first two ticks
            else pos = value < ticks[ 0 ] ? 0 : 1;

        } else {

            // If we found an intervall, we calculate the position based on the logarithm
            const [ a, b ] = [ ticks[ i0 ], ticks[ i0 + 1 ] ];
            const [ la, lb, lv ] = [ log( a ), log( b ), log( value ) ];
            const t = Math.abs( lb - la ) < 1e-15 ? 0 : ( lv - la ) / ( lb - la );

            pos = positions[ i0 ] + t * ( positions[ i0 + 1 ] - positions[ i0 ] );

        }

        // Return the position based on the reference point
        return ref === 'max' ? 1 - pos : pos;

    }

    /**
     * Sets the logarithmic base for the scale.
     * 
     * @param {number} base - The logarithmic base
     * @returns {this} The current instance
     * @throws {Error} If the base is not greater than 1
     */
    public setBase ( base: number ) : this {

        if ( ( base = Number ( base ) ) <= 1 ) throw new Error (
            `Logarithmic base must be greater than <1>, <${base}> given`
        );

        this.base = base;
        this.is = false;

        return this;

    }

    /**
     * Returns the logarithmic base of the scale.
     * 
     * @returns {number} The logarithmic base
     */
    public getBase () : number { return this.base }

}