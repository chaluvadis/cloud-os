import { Drive } from '../../../drive/models/drive';
import { AWSFileBroker } from '../../brokers/aws-file-broker';
import { File } from '../../models/file';

export class AWSFileService {
    constructor(private readonly fileBroker: AWSFileBroker) {}

    retrieveFile(drive: Drive, filePath: string): Promise<File> {
        throw new Error('Not implemented');
    }

    writeFile(drive: Drive, file: File): Promise<File> {
        throw new Error('Not implemented');
    }

    removeFile(drive: Drive, file: File): Promise<File> {
        throw new Error('Not implemented');
    }
}
