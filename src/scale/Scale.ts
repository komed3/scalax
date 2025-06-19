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

    protected is: boolean = false;

    constructor ( low?: number, high?: number, maxTicks?: number ) {

        if ( low !== undefined && high !== undefined ) this.setBounds( low, high );

        if ( maxTicks !== undefined ) this.setMaxTicks( maxTicks );

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

    public run ( ...opts: any[] ) : this {

        this.is = this.compute( opts );

        return this;

    }

    public getBounds () : { lower: number | undefined, upper: number | undefined } {

        return { lower: this.lowerBound, upper: this.upperBound };

    }

    public getMaxTicks () : number | undefined { return this.maxTicks }

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

}