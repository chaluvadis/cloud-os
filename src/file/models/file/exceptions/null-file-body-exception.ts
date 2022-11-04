import { Exception } from '../../../../libraries/exceptions';

export class NullFileBodyException extends Exception {
    constructor() {
        super('File body is null.');
    }
}
