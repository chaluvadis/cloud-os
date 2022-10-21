import { Exception } from '../../../../exceptions/exception';

export class NullFunctionException extends Exception {
    constructor() {
        super('Function is null.');
    }
}
