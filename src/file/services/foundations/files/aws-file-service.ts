import { Drive } from '../../../../drive/models/drive';
import { tryCatchAsync } from '../../../../../libraries/exception-handling';
import { AWSFileBroker } from '../../../brokers/files/aws-file-broker';
import { NullFileBodyException } from '../../../models/file/exceptions/null-file-body-exception';
import { File } from '../../../models/file/file';
import { AWSFileValidationException } from './exceptions/aws-file-validation-exception';

export class AWSFileService {
    constructor(private readonly fileBroker: AWSFileBroker) {}

    async retrieveFile(drive: Drive, filePath: string): Promise<File> {
        return tryCatchAsync(async () => {
            const response = await this.fileBroker.getReadableFileContent(
                drive,
                filePath
            );
            if (!response.Body) {
                throw new NullFileBodyException();
            }
            return new File(filePath, await response.Body.transformToString());
        })
            .handle(
                [NullFileBodyException],
                (exception) => new AWSFileValidationException(exception)
            )
            .execute();
    }

    async writeFile(drive: Drive, file: File): Promise<File> {
        await this.fileBroker.putFile(drive, file);
        return new File(file.path, file.content);
    }

    async removeFile(drive: Drive, file: File): Promise<File> {
        await this.fileBroker.deleteFile(drive, file);
        return new File(file.path, file.content);
    }
}
