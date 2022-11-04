import { tryCatchAsync } from '../../../../libraries/exception-handling';
import { NullBodyException } from '../../../models/file/exceptions/null-body-exception';
import { AWSFileValidationException } from './exceptions/aws-file-validation-exception';
import { Action } from '../../../../core/types/action';
import { File } from '../../../models/file/file';
import { NullResponseException } from '../../../models/file/exceptions/null-response-exception';
import { NullDriveException } from '../../../../drive/models/exceptions/null-drive-exception';
import { NullFilePathException } from '../../../models/file/exceptions/null-file-path-exception';
import { S3ServiceException } from '@aws-sdk/client-s3';
import { AWSFileDependencyException } from './exceptions/aws-file-dependency-exception';

export class AWSFileServiceExceptions {
    retriveFileAsync(logic: Action<Promise<File>>) {
        return tryCatchAsync(logic)
            .handle(
                [
                    NullBodyException,
                    NullResponseException,
                    NullDriveException,
                    NullFilePathException,
                ],
                (exception) => new AWSFileValidationException(exception)
            )
            .handle(
                [S3ServiceException],
                (exception) => new AWSFileDependencyException(exception)
            )
            .execute();
    }
}
