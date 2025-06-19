'use strict';

export abstract class Scale {

    protected precision: number = 1;

    protected lowerBound?: number;
    protected upperBound?: number;
    protected maxTicks?: number;

    protected min?: number;
    protected max?: number;
    protected stepSize?: number;
    protected tickAmount?: number;
    protected range?: number;

    protected is: boolean = false;

    constructor ( low?: number, high?: number, maxTicks?: number, precision?: number ) {

        if ( low !== undefined && high !== undefined ) this.setBounds( low, high );

        if ( maxTicks !== undefined ) this.setMaxTicks( maxTicks );

        if ( precision !== undefined ) this.setPrecision( precision );

    }

    protected assert () : void {

        if ( ! this.is ) throw new Error (
            `Scale is not yet ready; set the bounds, ticks and then call run()`
        );

    }

    protected compute ( ...opts: any[] ) : boolean {

        void [ opts ];

        throw new Error (
            `This method must be overwritten by the extending subclass`
        );

    }

    protected computeTicks () : number[] {

        throw new Error (
            `This method must be overwritten by the extending subclass`
        );

    }

    public setBounds ( low: number, high: number ) : this {

        low = Number ( low ), high = Number ( high );

        this.lowerBound = Math.min( low, high );
        this.upperBound = Math.max( low, high );

        return this;

    }

    public setMaxTicks ( maxTicks: number ) : this {

        this.maxTicks = Number ( maxTicks );

        return this;

    }

    public setPrecision ( precision: number ) : this {

        this.precision = Number ( precision );

        return this;

    }

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

    public run ( ...opts: any[] ) : this {

        if ( ! ( this.is = this.compute( opts ) ) ) throw new Error (
            `Failed to compute the scale, make sure boundaries and ticks are set`
        );

        return this;

    }

    public getBounds () : { lower: number | undefined, upper: number | undefined } {

        return { lower: this.lowerBound, upper: this.upperBound };

    }

    public getMaxTicks () : number | undefined { return this.maxTicks }

    public getPrecision () : number { return this.precision }

    public isReady () : boolean { return this.is }

    public isNegative () : boolean { this.assert(); return this.max! <= 0 }

    public crossesZero () : boolean { this.assert(); return this.min! < 0 && this.max! > 0 }

    public getMinimum () : number { this.assert(); return this.min! }

    public getMaximum () : number { this.assert(); return this.max! }

    public getExtrema () : { min: number, max: number } {

        this.assert();

        return { min: this.min!, max: this.max! };

    }

    public getStepSize () : number { this.assert(); return this.stepSize! }

    public getTickAmount () : number { this.assert(); return this.tickAmount! }

    public getRange () : number { this.assert(); return this.range! }

    public getTicks () : number[] {

        this.assert();

        return this.computeTicks().map( t => Number( t.toFixed( 8 ) ) );

    }

    public getTicksReverse () : number[] {

        this.assert();

        return this.getTicks().reverse();

    }

}