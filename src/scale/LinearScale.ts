'use strict';

import { Scale } from './Scale.js';

export class LinearScale extends Scale {

    constructor ( low?: number, high?: number, maxTicks?: number ) {

        super ( low, high, maxTicks );

    }

    private nearest ( value: number, round: boolean ) : number {

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

        if (
            this.lowerBound !== undefined &&
            this.upperBound !== undefined &&
            this.maxTicks !== undefined
        ) {

            const range: number = this.nearest(
                this.upperBound - this.lowerBound,
                false
            );

            this.stepSize = this.nearest(
                range / ( this.maxTicks! - 1 ),
                true
            );

            this.min = Math.floor(
                this.lowerBound / this.stepSize
            ) * this.stepSize;

            this.max = Math.ceil(
                this.upperBound / this.stepSize
            ) * this.stepSize;

            this.range = this.max - this.min;

            this.tickAmount = this.range / this.stepSize + 1;

            return true;

        }

        return false;

    }

}