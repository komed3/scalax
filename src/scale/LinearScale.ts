'use strict';

import { Scale } from './Scale.js';

export class LinearScale extends Scale {

    constructor ( low?: number, high?: number, maxTicks?: number, precision?: number ) {

        super ( low, high, maxTicks, precision );

    }

    private _nearest ( value: number, round: boolean ) : number {

        const exp: number = Math.floor( Math.log10( value ) );
        const val: number = value / Math.pow( 10, exp );

        let nearest: number = 0;

        for ( const [ near, test ] of Object.entries( [
            { 1: 1.0, 2: 2, 5: 5, 10: 10 },
            { 1: 1.5, 2: 3, 5: 7, 10: 10 }
        ][ round ? 1 : 0 ] ) ) {

            if ( round ? val < test : val <= test ) {

                nearest = Number ( near );
                break;

            }

        }

        return nearest * Math.pow( 10, exp );

    }

    protected override compute() : boolean {

        if (
            this.precision !== undefined &&
            this.lowerBound !== undefined &&
            this.upperBound !== undefined &&
            this.maxTicks !== undefined
        ) {

            const range: number = this._nearest(
                this.upperBound - this.lowerBound, false
            );

            this.stepSize = Math.max(
                this._nearest( range / ( this.maxTicks - 1 ), true ),
                this.precision
            );

            do {

                this.min = Math.floor( this.lowerBound / this.stepSize ) * this.stepSize;
                this.max = Math.ceil( this.upperBound / this.stepSize ) * this.stepSize;
                this.range = this.max - this.min;

                this.tickAmount = Math.round( this.range / this.stepSize ) + 1;

                if ( this.tickAmount <= this.maxTicks ) return true;

                this.stepSize = this._nearest( this.stepSize + this.precision, true );

            } while ( true );

        }

        return false;

    }

    protected override computeTicks () : number[] {

        return this.is ? Array.from( { length: this.tickAmount! },
            ( _, i ) => this.min! + ( i * this.stepSize! )
        ) : [];

    }

}