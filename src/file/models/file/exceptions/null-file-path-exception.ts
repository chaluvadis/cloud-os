import { Exception } from '../../../../../libraries/exceptions';

export class NullFilePathException extends Exception {
    constructor() {
        super(`File path is null.`);
    }
}
