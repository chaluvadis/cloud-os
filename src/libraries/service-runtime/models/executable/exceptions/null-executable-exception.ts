import { Exception } from '../../../../exceptions';

export class NullExecutableException extends Exception {
    constructor() {
        super('Executable is null.');
    }
}
