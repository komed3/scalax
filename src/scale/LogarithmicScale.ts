'use strict';

import { Scale } from './Scale.js';

export class LogarithmicScale extends Scale {

    protected base: number = 10;

    protected zero?: number;

    constructor ( low?: number, high?: number, maxTicks?: number, precision?: number, base?: number ) {

        super ( low, high, maxTicks, precision );

        if ( base !== undefined ) this.setBase( base );

    }

    protected _base ( value: number ) : number {

        return Math.log( Math.abs( value ) ) / Math.log( this.base );

    }

    protected _wrap ( lower: number, upper: number, precision: number ) : [ number, number ] {

        const expPrec: number = Math.round( this._base( precision ) );

        const bound = ( v: number, dir: 'floor' | 'ceil' ) => Math.pow(
            this.base, Math.max( expPrec, Math[ dir ]( this._base( v ) ) )
        );

        const min: number = lower < 0 ? -bound( lower, 'ceil' ) : lower > 0 ?  bound( lower, 'floor' ) : 0;
        const max: number = upper > 0 ?  bound( upper, 'ceil' ) : upper < 0 ? -bound( upper, 'floor' ) : 0;

        return [ min, max ];

    }

    protected _rawTicks ( lower: number, upper: number, precision: number ) : number[] {

        const [ min, max ] = this._wrap( lower, upper, precision );
        const expMin: number = Math.round( this._base( precision ) );
        const ticks: Set<number> = new Set ();

        const addRange = ( sign: 1 | -1, toExp: number ) : void => {

            for ( let e: number = expMin; e <= toExp; e++ ) {

                const tick: number = sign * Math.pow( this.base, e );

                if ( tick >= min && tick <= max ) ticks.add( tick );

            }

        };

        if ( min < 0 ) addRange( -1, Math.round( this._base( -min ) ) );

        if ( lower <= 0 && upper >= 0 || (
            Math.min( Math.abs( lower ), Math.abs( upper ) ) < precision
        ) ) ticks.add( 0 );

        if ( max > 0 ) addRange( 1, Math.round( this._base( max ) ) );

        return Array.from( ticks ).sort( ( a, b ) => a - b );

    }

    protected _prune ( lower: number, upper: number, precision: number, maxTicks: number ) : number[] {

        let prec: number = precision, attempts: number = 0, ticks: number[];

        do {

            ticks = this._rawTicks( lower, upper, prec );

            if ( ticks.length <= maxTicks ) return ticks;

            prec = Math.pow( this.base, Math.round( this._base( prec ) + 1 ) );
            attempts++;

        } while ( attempts < 100 );

        throw new Error(
            `Unable to reduce tick count to fit maximum allowed ticks <${maxTicks}>`
        );

    }

    protected _zero ( ticks: number[] ) : number {

        const cnt = ticks.filter( t => t !== 0 ).length;
        const neg = ticks.filter( t => t < 0 ).length;

        return cnt ? neg / cnt : 0;

    }

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

            // Find the zero point
            this.zero = this._zero( this.ticks );

            return true;

        }

        return false;

    }

    public setBase ( base: number ) : this {

        if ( ( base = Number ( base ) ) <= 1 ) throw new Error (
            `Logarithmic base must be greater than <1>, <${base}> given`
        );

        this.base = base;
        this.is = false;

        return this;

    }

    public getBase () : number { return this.base }

}