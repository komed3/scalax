'use strict';

import { Scale } from './Scale.js';

export class RadialScale extends Scale {

    constructor ( ticks?: number ) {

        super ( 0, 360, ticks );

    }

}