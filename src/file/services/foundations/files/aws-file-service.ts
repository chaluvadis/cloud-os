import { Readable } from 'stream';
import { Drive } from '../../../../drive/models/drive';
import { IAWSFileBroker } from '../../../brokers/files/aws-file-broker.interface';
import { File } from '../../../models/file/file';
import { IAWSFileService } from './aws-file-service.interface';
import { AWSFileServiceOperations } from './aws-file-service.operations';

export class AWSFileService
    extends AWSFileServiceOperations
    implements IAWSFileService
{
    constructor(fileBroker: IAWSFileBroker) {
        super(fileBroker);
    }

    retrieveFileAsync(drive: Drive, filePath: string): Promise<File> {
        return this.createRetrieveFileAsyncRuntime(async () => {
            this.validateDrive(drive);
            this.validateFilePath(filePath);
            const response = await this.fileBroker.getFile(drive, filePath);
            this.validateRetrieveFileResponse(response);
            return new File(filePath, response.Body as Readable);
        });
    }

    writeFileAsync(drive: Drive, file: File): Promise<File> {
        return this.createWriteFileAsyncRuntime(async () => {
            this.validateDrive(drive);
            this.validateFile(file);
            await this.fileBroker.putFile(drive, file);
            return new File(file.path, file.content);
        });
    }

    removeFileAsync(drive: Drive, file: File): Promise<File> {
        return this.createRemoveFileAsyncRuntime(async () => {
            this.validateDrive(drive);
            this.validateFile(file);
            await this.fileBroker.deleteFile(drive, file);
            return new File(file.path, file.content);
        });
    }
}
