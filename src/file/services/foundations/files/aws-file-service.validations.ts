import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { isNil } from '../../../../libraries/conditions';
import { NullFileBodyException } from '../../../models/file/exceptions/null-file-body-exception';

export class AWSFileServiceValidations {
    validateRetrieveFileResponse(response: GetObjectCommandOutput) {
        if (isNil(response.Body)) {
            throw new NullFileBodyException();
        }
    }
}
