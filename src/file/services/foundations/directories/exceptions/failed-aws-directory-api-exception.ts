import { Exception } from '../../../../../libraries/exceptions';

export class FailedAWSDirectoryApiException extends Exception {
    constructor(innerException: Exception) {
        super(
            'Failed AWS S3 api exception, see inner exception for details',
            innerException
        );
    }
}
