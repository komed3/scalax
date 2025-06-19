'use strict';

import { Scale } from './Scale.js';

export class LogarithmicScale extends Scale {

    protected base: number = 10;

    protected logMin?: number;
    protected logMax?: number;
    protected logRange?: number;

    constructor ( low?: number, high?: number, ticks?: number, base?: number ) {

        super ( low, high, ticks );

        if ( base !== undefined ) this.setBase( base );

    }

    private _base ( value: number ) : number {

        return value === 0 ? 0 : (
            Math.log( Math.abs( Number ( value ) ) ) /
            Math.log( this.base )
        );

    };

    private _nearest ( value: number ) : { lower: number, upper: number } {

        if ( value === 0 ) return { lower: 0, upper: 0 };

        const logValue = this._base( value );
        const sign = value < 1 ? -1 : 1;

        return {
            lower: Math.pow( this.base, Math.floor( logValue ) ) * sign,
            upper: Math.pow( this.base, Math.ceil( logValue ) ) * sign
        };

    }

    protected override compute () : boolean {

        if (
            this.lowerBound !== undefined &&
            this.upperBound !== undefined &&
            this.base !== undefined
        ) {

            const nearestLower = this._nearest( this.lowerBound );
            const nearestUpper = this._nearest( this.upperBound );

            this.min = this.lowerBound < 0
                ? nearestLower.upper
                : nearestLower.lower;

            this.max = this.upperBound < 0
                ? nearestUpper.lower
                : nearestUpper.upper;

            this.range = this.max - this.min;

            this.logMin = this._base( this.min );
            this.logMax = this._base( this.max );

            this.logRange = this.logMax - this.logMin;

            return true;

        }

        return false;

    }

    public setBase ( base: number ) : this {

        this.base = Number ( base );
        this.is = false;

        return this;

    }

    public getBase () : number { return this.base }

}