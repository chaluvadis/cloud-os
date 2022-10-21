import { Exception } from '../../../../exceptions';

export class NullFunctionException extends Exception {
    constructor() {
        super('Function is null.');
    }
}
