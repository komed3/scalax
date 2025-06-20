'use strict';

import { Scale } from './Scale.js';

export class LogarithmicScale extends Scale {

    protected base: number = 10;

    constructor ( low?: number, high?: number, maxTicks?: number, precision?: number, base?: number ) {

        super ( low, high, maxTicks, precision );

        if ( base !== undefined ) this.setBase( base );

    }

    protected _base ( value: number ) : number {

        return value === 0 ? 0 : (
            Math.log( Math.abs( Number ( value ) ) ) /
            Math.log( this.base )
        );

    };

    protected _nearest ( value: number ) : { lower: number, upper: number } {

        const sign: number = Math.sign( value ) || 1;

        if ( Math.abs( value ) < this.precision ) return sign > 0
            ? { lower: 0, upper: this.precision }
            : { lower: -this.precision, upper: 0 };

        let expLower: number = Math.floor( this._base( value ) );
        let expUpper: number = expLower + 1;

        let lower: number, upper: number;

        do {

            lower = Number ( Math.pow( this.base, expLower ).toFixed( 9 ) );
            upper = Number ( Math.pow( this.base, expUpper ).toFixed( 9 ) );

            if ( ( upper - lower ) >= this.precision ) return {
                lower: lower * sign, upper: upper * sign
            }

            expLower--, expUpper++;

        } while ( true );

    }

    public setBase ( base: number ) : this {

        this.base = Number ( base );
        this.is = false;

        return this;

    }

    public getBase () : number { return this.base }

}