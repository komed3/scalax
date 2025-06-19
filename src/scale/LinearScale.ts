'use strict';

import { Scale } from './Scale.js';

export class LinearScale extends Scale {

    constructor ( low?: number, high?: number, ticks?: number ) {

        super ( low, high, ticks );

    }

    protected override nearest ( value: number, round: boolean ) : number {

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

    protected override compute () : boolean {

        const range: number = this.nearest (
            this.upperBound! - this.lowerBound!,
            false
        );

        this.stepSize = this.nearest(
            range / ( this.maxTicks! - 1 ),
            true
        );

        this.min = Math.floor(
            this.lowerBound! / this.stepSize
        ) * this.stepSize;

        this.max = Math.ceil(
            this.upperBound! / this.stepSize
        ) * this.stepSize;

        this.range = this.max - this.min;

        this.tickAmount = this.range / this.stepSize + 1;

        return true;

    }

    protected override calcTicks () : number[] {

        return Array.from( { length: this.tickAmount! },
            ( _, i ) => this.min! + ( i * this.stepSize! )
        );

    }

    protected override calcPointAt( pct: number ) : number {

        return this.min! + ( pct * this.range! );

    }

}