'use strict';

import { LinearScale } from './scale/LinearScale.js';
import { LogarithmicScale } from './scale/LogarithmicScale.js';
import { RadialScale } from './scale/RadialScale.js';

export const Scale = {
    linear: LinearScale,
    logarithmic: LogarithmicScale,
    radial: RadialScale
}