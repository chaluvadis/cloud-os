import { S3ServiceException } from '@aws-sdk/client-s3';
import { Action } from '../../../../core/types/action';
import { NullDriveException } from '../../../../drive/models/exceptions/null-drive-exception';
import { tryCatchAsync } from '../../../../libraries/exception-handling';
import { Directory } from '../../../models/directory/directory';
import { NullDirectoryContentsException } from '../../../models/directory/exceptions/null-directory-contents-exception';
import { IllegalFilePathException } from '../../../models/file/exceptions/illegal-file-path-exception';
import { NullFilePathException } from '../../../models/file/exceptions/null-file-path-exception';
import { AWSDirectoryDependencyException } from './exceptions/aws-directory-directory-exception';
import { AWSDirectoryValidationException } from './exceptions/aws-directory-validation-exception';
import { FailedAWSDirectoryApiException } from './exceptions/failed-aws-directory-api-exception';

export class AWSDirectoryServiceExceptions {
    retrieveDirectory(logic: Action<Promise<Directory>>): Promise<Directory> {
        return tryCatchAsync(logic)
            .handle(
                [
                    NullDirectoryContentsException,
                    NullFilePathException,
                    NullDriveException,
                    IllegalFilePathException,
                ],
                (exception) => new AWSDirectoryValidationException(exception)
            )
            .handle([S3ServiceException], (exception) => {
                const failedException = new FailedAWSDirectoryApiException(
                    exception
                );
                return new AWSDirectoryDependencyException(failedException);
            })
            .execute();
    }

    makeDirectory(logic: Action<Promise<Directory>>): Promise<Directory> {
        return tryCatchAsync(logic)
            .handle(
                [
                    NullFilePathException,
                    NullDriveException,
                    IllegalFilePathException,
                ],
                (exception) => new AWSDirectoryValidationException(exception)
            )
            .handle([S3ServiceException], (exception) => {
                const failedException = new FailedAWSDirectoryApiException(
                    exception
                );
                return new AWSDirectoryDependencyException(failedException);
            })
            .execute();
    }
}
