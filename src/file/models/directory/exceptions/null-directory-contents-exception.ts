import { Exception } from '../../../../../libraries/exceptions';

export class NullDirectoryContentsException extends Exception {
    constructor() {
        super(`Directory contents is null.`);
    }
}
