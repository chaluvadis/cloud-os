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
import { NullFileException } from '../../../models/file/exceptions/null-file-exception';
import { IllegalFileException } from '../../../models/file/exceptions/illegal-file-exception';
import { IllegalFilePathException } from '../../../models/file/exceptions/illegal-file-path-exception';
import { FailedAWSFileApiException } from './exceptions/failed-aws-file-api-exception';
import { AWSFileServiceValidations } from './aws-file-service.validations';

export class AWSFileServiceExceptionHandlers extends AWSFileServiceValidations {
    retrieveFileExceptionHandlerAsync(logic: Action<Promise<File>>) {
        return tryCatchAsync(logic)
            .handle(
                [
                    NullBodyException,
                    NullResponseException,
                    NullDriveException,
                    NullFilePathException,
                    IllegalFilePathException,
                ],
                (exception) => new AWSFileValidationException(exception)
            )
            .handle([S3ServiceException], (exception) => {
                const failedFileWrite = new FailedAWSFileApiException(
                    exception
                );
                return new AWSFileDependencyException(failedFileWrite);
            })
            .execute();
    }

    writeFileExceptionHandlerAsync(logic: Action<Promise<File>>) {
        return tryCatchAsync(logic)
            .handle(
                [NullDriveException, NullFileException, IllegalFileException],
                (exception) => new AWSFileValidationException(exception)
            )
            .handle([S3ServiceException], (exception) => {
                const failedFileWrite = new FailedAWSFileApiException(
                    exception
                );
                return new AWSFileDependencyException(failedFileWrite);
            })
            .execute();
    }

    removeFileExceptionHandlerAsync(logic: Action<Promise<File>>) {
        return tryCatchAsync(logic)
            .handle(
                [NullDriveException, NullFileException, IllegalFileException],
                (exception) => new AWSFileValidationException(exception)
            )
            .handle([S3ServiceException], (exception) => {
                const failedFileRemoval = new FailedAWSFileApiException(
                    exception
                );
                return new AWSFileDependencyException(failedFileRemoval);
            })
            .execute();
    }
}
