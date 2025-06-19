'use strict';

export abstract class Scale {

    private lowerBound: number;
    private upperBound: number;
    private ticks: number;

    private is: boolean = false;

    constructor ( low?: number, high?: number, ticks?: number ) {

        if ( low && high ) this.setBounds( low, high );

        if ( ticks ) this.setMaxTicks( ticks );

    }

    public setBounds ( low: number, high: number ) : this {

        low = Number ( low ), high = Number ( high );

        this.lowerBound = Math.min( low, high );
        this.upperBound = Math.max( low, high );
        this.is = false;

        return this;

    }

    public setMaxTicks ( ticks: number ) : this {

        this.ticks = Math.max( 1, Number ( ticks ) );
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

    public getMaxTicks () : number { return this.ticks }

    public isReady () : boolean { return this.is }

    getMinium () {}

    getMaximum () {}

    getRange () {}

    getTicks () {}

    getReverseTicks () {}

    getPos () {}

    getPointAt () {}

}