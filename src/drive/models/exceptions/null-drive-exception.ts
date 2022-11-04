import { Exception } from '../../../libraries/exceptions';

export class NullDriveException extends Exception {
    constructor() {
        super('Drive is null.');
    }
}
