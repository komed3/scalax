/**
 * Abstract Scale Class
 * src/scale/Scale.ts
 * 
 * The abstract `Scale` class provides base methods and properties for creating
 * various types of scales.
 * 
 * This class is designed to be extended by specific scale implementations, such
 * as linear or logarithmic scales. It cannot be instantiated directly.
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

/**
 * Abstract base class for scales.
 * Provides methods for setting bounds, precision, and computing scale values.
 * 
 * @abstract
 */
export abstract class Scale {

    // The precision for the scale calculations, default is 1
    protected precision: number = 1;

    // The lower and upper bounds of the scale
    protected lowerBound?: number;
    protected upperBound?: number;

    // The maximum number of ticks on the scale
    protected maxTicks?: number;

    // The computed values for the scale
    protected min?: number;
    protected max?: number;
    protected stepSize?: number;
    protected tickAmount?: number;
    protected range?: number;

    // The computed ticks
    protected ticks?: number[];

    // Indicates whether the scale is ready for use
    protected is: boolean = false;

    /**
     * Creates a new Scale instance.
     * 
     * @param {number} [low] - The lower bound of the scale
     * @param {number} [high] - The upper bound of the scale
     * @param {number} [maxTicks] - The maximum number of ticks on the scale
     * @param {number} [precision] - The precision for the scale calculations
     */
    constructor ( low?: number, high?: number, maxTicks?: number, precision?: number ) {

        // Set the bounds, if provided
        if ( low !== undefined && high !== undefined ) this.setBounds( low, high );

        // Set the maximum ticks, if provided
        if ( maxTicks !== undefined ) this.setMaxTicks( maxTicks );

        // Set the precision, if provided
        if ( precision !== undefined ) this.setPrecision( precision );

    }

    /**
     * Asserts that the scale is ready for use.
     * Throws an error if the scale is not ready.
     * 
     * @throws {Error} If the scale is not ready
     */
    protected assert () : void {

        if ( ! this.is ) throw new Error (
            `Scale is not yet ready; set the bounds, ticks and then call run()`
        );

    }

    /**
     * Computes the scale based on the provided options.
     * This method must be overridden by extending subclasses.
     * 
     * @param {...any[]} [opts] - Options for computing the scale
     * @returns {boolean} - Returns true if the scale was computed successfully
     * @throws {Error} If this method is not overridden
     */
    protected compute ( ...opts: any[] ) : boolean {

        void [ opts ];

        throw new Error (
            `This method must be overwritten by the extending subclass`
        );

    }

    /**
     * Computes a point on the scale based on a percentage.
     * This method must be overridden by extending subclasses.
     * 
     * @param {number} pct - The percentage (0 to 1) to compute the point for
     * @returns {number[]} - An array representing the computed point
     * @throws {Error} If this method is not overridden
     */
    protected computePoint ( pct: number ) : number {

        void [ pct ];

        throw new Error (
            `This method must be overwritten by the extending subclass`
        );

    }

    /**
     * Computes the percentage of a value relative to the scale's min or max.
     * This method must be overridden by extending subclasses.
     * 
     * @param {number} value - The value to compute the percentage for
     * @param {'min' | 'max'} ref - Reference point, either 'min' or 'max'
     * @returns {number} - The computed percentage
     * @throws {Error} If this method is not overridden
     */
    protected computePct ( value: number, ref: 'min' | 'max' ) : number {

        void [ value, ref ];

        throw new Error (
            `This method must be overwritten by the extending subclass`
        );

    }

    /**
     * Sets the bounds for the scale.
     * 
     * @param {number} low - The lower bound of the scale
     * @param {number} high - The upper bound of the scale
     * @returns {this} - Returns the current instance for method chaining
     */
    public setBounds ( low: number, high: number ) : this {

        low = Number ( low ), high = Number ( high );

        this.lowerBound = Math.min( low, high );
        this.upperBound = Math.max( low, high );
        this.is = false;

        return this;

    }

    /**
     * Sets the maximum number of ticks for the scale.
     * 
     * @param {number} maxTicks - The maximum number of ticks
     * @returns {this} - Returns the current instance for method chaining
     */
    public setMaxTicks ( maxTicks: number ) : this {

        if ( ( maxTicks = Number ( maxTicks ) ) <= 1 ) throw new Error (
            `Maximum number of ticks must be an integer value greater than <1>, <${maxTicks}> given`
        );

        this.maxTicks = Math.round( maxTicks );
        this.is = false;

        return this;

    }

    /**
     * Sets the precision for the scale calculations.
     * 
     * @param {number} precision - The precision value
     * @returns {this} - Returns the current instance for method chaining
     */
    public setPrecision ( precision: number ) : this {

        if ( ( precision = Number ( precision ) ) <= 0 ) throw new Error (
            `Precision must be greater than <0>, <${precision}> given`
        );

        this.precision = precision;
        this.is = false;

        return this;

    }

    /**
     * Centers the scale around a given value.
     * The lower and upper bounds are adjusted to be equidistant from the value.
     * 
     * @param {number} [value=0] - The value to center the scale around
     * @returns {this} - Returns the current instance for method chaining
     * @throws {Error} If the lower and upper bounds are not set
     */
    public centerAt ( value: number = 0 ) : this {

        if (
            this.lowerBound !== undefined &&
            this.upperBound !== undefined
        ) {

            value = Number ( value );

            const abs: number = Math.max(
                Math.abs( value - this.lowerBound ),
                Math.abs( value - this.upperBound )
            );

            this.lowerBound = value - abs;
            this.upperBound = value + abs;
            this.is = false;

            return this;

        }

        throw new Error (
            `The lower and upper bounds need to be set, call setBounds()`
        );

    }

    /**
     * Runs the scale computation with the provided options.
     * This method calls the compute method and sets the scale as ready.
     * 
     * @param {...any[]} [opts] - Options for computing the scale
     * @returns {this} - Returns the current instance for method chaining
     * @throws {Error} If the scale cannot be computed
     */
    public run ( ...opts: any[] ) : this {

        if ( ! ( this.is = this.compute( opts ) ) ) throw new Error (
            `Failed to compute the scale, make sure boundaries and ticks are set`
        );

        return this;

    }

    /**
     * Gets the bounds of the scale.
     * 
     * @returns {{ lower: number | undefined, upper: number | undefined }} - An object containing the lower and upper bounds
     */
    public getBounds () : { lower: number | undefined, upper: number | undefined } {

        return { lower: this.lowerBound, upper: this.upperBound };

    }

    /**
     * Gets the maximum number of ticks for the scale.
     * 
     * @returns {number | undefined} - The maximum number of ticks, or undefined if not set
     */
    public getMaxTicks () : number | undefined { return this.maxTicks }

    /**
     * Gets the precision of the scale.
     * 
     * @returns {number} - The precision value
     */
    public getPrecision () : number { return this.precision }

    /**
     * Checks if the scale is ready for use.
     * 
     * @returns {boolean} - Returns true if the scale is ready, false otherwise
     */
    public isReady () : boolean { return this.is }

    /**
     * Checks whether the whole scale is in the negative range.
     * 
     * @returns {boolean} - Returns true if the scale is entirely negative, false otherwise
     */
    public isNegative () : boolean { this.assert(); return this.max! <= 0 }

    /**
     * Checks whether the scale crosses the zero point.
     * 
     * @returns {boolean} - Returns true if the scale crosses zero, false otherwise
     */
    public crossesZero () : boolean { this.assert(); return this.min! < 0 && this.max! > 0 }

    /**
     * Get the minimum value of the scale.
     * 
     * @returns {number} - The minimum value of the scale
     */
    public getMinimum () : number { this.assert(); return this.min! }

    /**
     * Get the maximum value of the scale.
     * 
     * @returns {number} - The maximum value of the scale
     */
    public getMaximum () : number { this.assert(); return this.max! }

    /**
     * Get the extrema of the scale as an object containing min and max values.
     * 
     * @returns {{ min: number, max: number }} - An object with min and max values of the scale
     */
    public getExtrema () : { min: number, max: number } {

        this.assert();

        return { min: this.min!, max: this.max! };

    }

    /**
     * Get the step size of the scale.
     * 
     * @returns {number} - The step size of the scale
     */
    public getStepSize () : number { this.assert(); return this.stepSize! }

    /**
     * Get the number of ticks on the scale.
     * 
     * @returns {number} - The number of ticks on the scale
     */
    public getTickAmount () : number { this.assert(); return this.tickAmount! }

    /**
     * Get the range of the scale.
     * 
     * @returns {number} - The range of the scale
     */
    public getRange () : number { this.assert(); return this.range! }

    /**
     * Get the ticks of the scale as an array of numbers.
     * 
     * @returns {number[]} - An array of ticks computed for the scale
     * @throws {Error} If the scale is not ready
     */
    public getTicks () : number[] {

        this.assert();

        return this.ticks!.map( t => Number( t.toFixed( 8 ) ) );

    }

    /**
     * Get the ticks of the scale in reverse order.
     * 
     * @returns {number[]} - An array of ticks computed for the scale, in reverse order
     * @throws {Error} If the scale is not ready
     */
    public getTicksReverse () : number[] {

        this.assert();

        return this.getTicks().reverse();

    }

    /**
     * Get a point on the scale at a given percentage.
     * 
     * @param {number} pct - The percentage (0 to 1) to compute the point for
     * @returns {number} - The computed point on the scale
     * @throws {Error} If the scale is not ready
     */
    public getPointAt ( pct: number ) : number {

        this.assert();

        return this.computePoint( pct );

    }

    /**
     * Get the percentage of a value relative to the scale's min or max.
     * 
     * @param {number} value - The value to compute the percentage for
     * @param {'min' | 'max'} [ref='min'] - Reference point, either 'min' or 'max'
     * @returns {number} - The computed percentage
     * @throws {Error} If the scale is not ready
     */
    public getPct ( value: number, ref: 'min' | 'max' = 'min' ) : number {

        this.assert();

        return this.computePct( value, ref );

    }

}