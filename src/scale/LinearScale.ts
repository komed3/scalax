'use strict';

import { Scale } from './Scale';

export class LinearScale extends Scale {

    constructor ( low?: number, high?: number, ticks?: number ) {

        super ( low, high, ticks );

    }

}