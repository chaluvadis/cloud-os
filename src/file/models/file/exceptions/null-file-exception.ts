import { Exception } from '../../../../libraries/exceptions';

export class NullFileException extends Exception {
    constructor() {
        super('File is null.');
    }
}
