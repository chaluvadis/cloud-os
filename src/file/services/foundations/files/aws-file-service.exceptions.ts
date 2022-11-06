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
import { FailedFileRetrievalException } from './exceptions/failed-file-retrieval-exception';
import { AWSFileServiceException } from './exceptions/aws-file-service-exception';
import { NullFileException } from '../../../models/file/exceptions/null-file-exception';
import { FailedFileWriteException } from './exceptions/failed-file-write-exception';
import { FailedFileRemovalException } from './exceptions/failed-file-removal-exception';

export class AWSFileServiceExceptions {
    retrieveFileAsync(logic: Action<Promise<File>>) {
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
            .catchAll((exception) => {
                const failedFileRetrieval = new FailedFileRetrievalException(
                    exception
                );
                return new AWSFileServiceException(failedFileRetrieval);
            })
            .execute();
    }

    writeFileAsync(logic: Action<Promise<File>>) {
        return tryCatchAsync(logic)
            .handle(
                [NullDriveException, NullFileException],
                (exception) => new AWSFileValidationException(exception)
            )
            .handle(
                [S3ServiceException],
                (exception) => new AWSFileDependencyException(exception)
            )
            .catchAll((exception) => {
                const failedFileWrite = new FailedFileWriteException(exception);
                return new AWSFileServiceException(failedFileWrite);
            })
            .execute();
    }

    removeFileAsync(logic: Action<Promise<File>>) {
        return tryCatchAsync(logic)
            .handle(
                [NullDriveException, NullFileException],
                (exception) => new AWSFileValidationException(exception)
            )
            .handle(
                [S3ServiceException],
                (exception) => new AWSFileDependencyException(exception)
            )
            .catchAll((exception) => {
                const failedFileRemoval = new FailedFileRemovalException(
                    exception
                );
                return new AWSFileServiceException(failedFileRemoval);
            })
            .execute();
    }
}
