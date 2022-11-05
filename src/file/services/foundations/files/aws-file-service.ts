import { Readable } from 'stream';
import { Drive } from '../../../../drive/models/drive';
import { AWSFileBroker } from '../../../brokers/files/aws-file-broker';
import { File } from '../../../models/file/file';
import { IAWSFileService } from './aws-file-service.interface';
import { AWSFileServiceOperations } from './aws-file-service.operations';
import { AWSFileServiceValidations } from './aws-file-service.validations';

export class AWSFileService implements IAWSFileService {
    private readonly operations: AWSFileServiceOperations;
    private readonly validations: AWSFileServiceValidations;

    constructor(private readonly fileBroker: AWSFileBroker) {
        this.operations = new AWSFileServiceOperations();
        this.validations = new AWSFileServiceValidations();
    }

    retrieveFileAsync(drive: Drive, filePath: string): Promise<File> {
        return this.operations.retriveFileAsync(async () => {
            this.validations.validateDrive(drive);
            this.validations.validateFilePath(filePath);
            const response = await this.fileBroker.getReadableFileContent(
                drive,
                filePath
            );
            this.validations.validateRetrieveFileResponse(response);
            return new File(filePath, response.Body as Readable);
        });
    }

    writeFileAsync(drive: Drive, file: File): Promise<File> {
        return this.operations.writeFileAsync(async () => {
            this.validations.validateDrive(drive);
            this.validations.validateFile(file);
            await this.fileBroker.putFile(drive, file);
            return new File(file.path, file.content);
        });
    }

    async removeFileAsync(drive: Drive, file: File): Promise<File> {
        await this.fileBroker.deleteFile(drive, file);
        return new File(file.path, file.content);
    }
}
