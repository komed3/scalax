'use strict';

import { LinearScale } from './LinearScale.js';

export class RadialScale extends LinearScale {

    constructor ( ticks?: number, low: number = 0, high: number = 360 ) {

        super ( low % 360, high % 360, ticks );

    }

}