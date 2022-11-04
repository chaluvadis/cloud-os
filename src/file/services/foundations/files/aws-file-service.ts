import { Drive } from '../../../../drive/models/drive';
import { AWSFileBroker } from '../../../brokers/files/aws-file-broker';
import { NullFileBodyException } from '../../../models/file/exceptions/null-file-body-exception';
import { File } from '../../../models/file/file';
import { AWSFileServiceOperations } from './aws-file-service.operations';

export class AWSFileService {
    private readonly operations: AWSFileServiceOperations;

    constructor(private readonly fileBroker: AWSFileBroker) {
        this.operations = new AWSFileServiceOperations();
    }

    async retrieveFile(drive: Drive, filePath: string): Promise<File> {
        return this.operations.retriveFileAsync(async () => {
            const response = await this.fileBroker.getReadableFileContent(
                drive,
                filePath
            );
            if (!response.Body) {
                throw new NullFileBodyException();
            }
            return new File(filePath, await response.Body.transformToString());
        });
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
