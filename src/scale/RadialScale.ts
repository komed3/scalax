'use strict';

import { Scale } from './Scale.js';

export class RadialScale extends Scale {

    constructor ( ticks?: number, precision?: number, low: number = 0, high: number = 360 ) {

        super ( low % 360, high % 360, ticks, precision );

    }

}