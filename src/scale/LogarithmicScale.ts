'use strict';

import { Scale } from './Scale.js';

export class LogarithmicScale extends Scale {

    protected base: number = 10;

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

        const delta: number = Number.EPSILON;
        const positions: number[] = ticks.map( ( _, i ) => i / ( n - 1 ) );

        const log = ( v: number ) : number => (
            Math.log( Math.abs( v ) + delta ) / Math.log( base )
        );

        // Find the intervall
        const i0: number = ticks.findIndex( ( t, i ) => (
            i < n - 1 && value >= t && value <= ticks[ i + 1 ]
        ) );

        let pos: number;

        if ( i0 === -1 ) {

            if ( value <= ticks[ 0 ] ) pos = 0;

            else if ( value >= ticks[ n - 1 ] ) pos = 1;

            else if ( zeroIndex !== -1 ) pos = value < 0
                ? positions[ Math.max( 0, zeroIndex - 1 ) ]
                : positions[ Math.min( n - 1, zeroIndex + 1 ) ];

            else pos = value < ticks[ 0 ] ? 0 : 1;

        } else {

            const [ a, b ] = [ ticks[ i0 ], ticks[ i0 + 1 ] ];
            const [ la, lb, lv ] = [ log( a ), log( b ), log( value ) ];
            const t = Math.abs( lb - la ) < 1e-15 ? 0 : ( lv - la ) / ( lb - la );

            pos = positions[ i0 ] + t * ( positions[ i0 + 1 ] - positions[ i0 ] );

        }

        return ref === 'max' ? 1 - pos : pos;

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