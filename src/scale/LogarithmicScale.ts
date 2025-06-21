'use strict';

import { Scale } from './Scale.js';

export class LogarithmicScale extends Scale {

    protected base: number = 10;

    constructor ( low?: number, high?: number, maxTicks?: number, precision?: number, base?: number ) {

        super ( low, high, maxTicks, precision );

        if ( base !== undefined ) this.setBase( base );

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