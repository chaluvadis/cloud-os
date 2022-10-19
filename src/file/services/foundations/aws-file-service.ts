import { Drive } from '../../../drive/models/drive';
import { tryCatchAsync } from '../../../libraries/exceptions/try-catch';
import { AWSFileBroker } from '../../brokers/aws-file-broker';
import { NullFileBodyException } from '../../models/file/exceptions/null-file-body-exception';
import { File } from '../../models/file/file';
import { AwsFileValidationException } from './exceptions/aws-file-validation-exception';

export class AWSFileService {
    constructor(private readonly fileBroker: AWSFileBroker) {}

    async retrieveFile(drive: Drive, filePath: string): Promise<File> {
        return tryCatchAsync(
            async () => {
                const response = await this.fileBroker.getReadableFileContent(
                    drive,
                    filePath
                );
                if (!response.Body) {
                    throw new NullFileBodyException();
                }
                return new File(
                    filePath,
                    await response.Body!.transformToString()
                );
            },
            (exception, exceptionType) => {
                switch (exceptionType) {
                    case NullFileBodyException:
                        return new AwsFileValidationException(exception);
                    default:
                        return exception;
                }
            }
        );
    }

    writeFile(drive: Drive, file: File): Promise<File> {
        throw new Error('Not implemented');
    }

    removeFile(drive: Drive, file: File): Promise<File> {
        throw new Error('Not implemented');
    }
}
