import { Exception } from '../../../../../libraries/exceptions';

export class FailedAWSFileApiException extends Exception {
    constructor(innerException: Exception) {
        super(
            'Failed aws file api exception, see inner exception for more details',
            innerException
        );
    }
}
