'use strict';

export abstract class Scale {

    protected lowerBound?: number;
    protected upperBound?: number;
    protected maxTicks?: number;

    protected min?: number;
    protected max?: number;
    protected stepSize?: number;
    protected tickAmount?: number;
    protected range?: number;

    private is: boolean = false;

    constructor ( low?: number, high?: number, ticks?: number ) {

        if ( low !== undefined && high !== undefined ) this.setBounds( low, high );

        if ( ticks !== undefined ) this.setMaxTicks( ticks );

    }

    protected assert () : void {

        if ( ! this.is ) throw new Error (
            `Scale is not yet ready; set the bounds, ticks and then call run()`
        );

    }

    protected nearest ( value: number, ...opts: any ) : any {

        void [ value, opts ];

        throw new Error (
            `This method must be overwritten by the extending subclass`
        );

    }

    protected compute ( ...opts: any ) : boolean {

        void [ opts ];

        throw new Error (
            `This method must be overwritten by the extending subclass`
        );

    }

    protected calcTicks ( ...opts: any ) : number[] {

        void [ opts ];

        throw new Error (
            `This method must be overwritten by the extending subclass`
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
            `The lower and upper bounds need to be set, call setBounds()`
        );

    }

    public getLowerBound () : number | undefined { return this.lowerBound }

    public getUpperBound () : number | undefined { return this.upperBound }

    public getMaxTicks () : number | undefined { return this.maxTicks }

    public run ( ...opts: any ) : this {

        if (
            this.lowerBound !== undefined &&
            this.upperBound !== undefined &&
            this.maxTicks !== undefined
        ) {

            this.is = this.compute( opts );

            return this;

        }

        throw new Error (
            `The scale cannot be calculated yet, first set bounds and ticks`
        );

    }

    public isReady () : boolean { return this.is }

    public isNegative () : boolean { this.assert(); return this.max! <= 0 }

    public crossesZero () : boolean { this.assert(); return this.min! < 0 && this.max! > 0 }

    public getMinium () : number { this.assert(); return this.min! }

    public getMaximum () : number { this.assert(); return this.max! }

    public getStepSize () : number { this.assert(); return this.stepSize! }

    public getTickAmount () : number { this.assert(); return this.tickAmount! }

    public getRange () : number { this.assert(); return this.range! }

    public getTicks () : number[] { this.assert(); return this.calcTicks() }

    public getReverseTicks () : number[] { this.assert(); return this.calcTicks().reverse() }

    public getPos () {}

    public getPointAt () {}

}