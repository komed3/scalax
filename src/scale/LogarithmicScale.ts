'use strict';

import { Scale } from './Scale.js';

export class LogarithmicScale extends Scale {

    protected base: number = 10;

    constructor ( low?: number, high?: number, ticks?: number, base?: number ) {

        super ( low, high, ticks );

        if ( base !== undefined ) this.base = Number ( base );

    }

    public setBase ( base: number ) : this {

        this.base = Number ( base );
        this.is = false;

        return this;

    }

    public getBase () : number { return this.base }

}