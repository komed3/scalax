'use strict';

export abstract class Scale {

    private lowerBound: number;
    private upperBound: number;
    private maxTicks: number;

    private min: number;
    private max: number;
    private stepSize: number;
    private tickAmount: number;
    private range: number;

    private is: boolean = false;

    constructor ( low?: number, high?: number, ticks?: number ) {

        if ( low && high ) this.setBounds( low, high );

        if ( ticks ) this.setMaxTicks( ticks );

    }

    protected assert () : void {

        if ( ! this.is ) throw new Error (
            `Scale is not yet ready; set the bounds, ticks and then call compute()`
        );

    }

    public setBounds ( low: number, high: number ) : this {

        low = Number ( low ), high = Number ( high );

        this.lowerBound = Math.min( low, high );
        this.upperBound = Math.max( low, high );
        this.is = false;

        return this;

    }

    public setMaxTicks ( ticks: number ) : this {

        this.maxTicks = Math.max( 1, Number ( ticks ) );
        this.is = false;

        return this;

    }

    public centerAt ( value: number = 0 ) : this {

        if (
            this.lowerBound !== undefined &&
            this.upperBound !== undefined
        ) {

            value = Number ( value );

            let abs = Math.max(
                Math.abs( value - this.lowerBound ),
                Math.abs( value - this.upperBound )
            );

            this.lowerBound = value - abs;
            this.upperBound = value + abs;
            this.is = false;

            return this;

        }

        throw new Error (
            `lower and upper bounds need to be set, call setBounds()`
        );

    }

    public getLowerBound () : number { return this.lowerBound }

    public getUpperBound () : number { return this.upperBound }

    public getMaxTicks () : number { return this.maxTicks }

    public isReady () : boolean { return this.is }

    public isNegative () : boolean { return this.is && this.max <= 0 }

    public crossesZero () : boolean { return this.is && this.min < 0 && this.max > 0 }

    public getMinium () : number | undefined { this.assert(); return this.min }

    public getMaximum () : number | undefined { this.assert(); return this.max }

    public getStepSize () : number | undefined { this.assert(); return this.stepSize }

    public getTickAmount () : number | undefined { this.assert(); return this.tickAmount }

    public getRange () : number | undefined { this.assert(); return this.range }

    public getTicks () {}

    public getReverseTicks () {}

    public getPos () {}

    public getPointAt () {}

}