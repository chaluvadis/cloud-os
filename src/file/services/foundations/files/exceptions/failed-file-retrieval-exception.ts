import { Exception } from '../../../../../libraries/exceptions';

export class FailedFileRetrievalException extends Exception {
    constructor(exception: Exception) {
        super('Failed to retrieve file, contact support.', exception);
    }
}
