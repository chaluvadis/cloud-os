import { Exception } from '../../../../libraries/exceptions/exception';

export class NullDirectoryContentsException extends Exception {
    constructor() {
        super(`Directory contents is null.`);
    }
}
