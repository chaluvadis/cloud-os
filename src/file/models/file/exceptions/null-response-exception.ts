import { Exception } from '../../../../libraries/exceptions';

export class NullResponseException extends Exception {
    constructor() {
        super('Response is null.');
    }
}
