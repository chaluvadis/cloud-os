import {
    ListObjectsCommandOutput,
    _Object as AWSObject,
} from '@aws-sdk/client-s3';
import { NullDirectoryContentsException } from '../../../models/directory/exceptions/null-directory-contents-exception';
import { NullFilePathException } from '../../../models/file/exceptions/null-file-path-exception';

export class AWSDirectoryServiceValidations {
    validateAWSObject(awsObject: AWSObject) {
        if (!awsObject.Key) {
            throw new NullFilePathException();
        }
    }

    validateAWSListObjectsResponse(response: ListObjectsCommandOutput) {
        if (!response.Contents) {
            throw new NullDirectoryContentsException();
        }
    }
}
