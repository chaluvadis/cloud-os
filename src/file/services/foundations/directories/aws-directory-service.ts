import { Drive } from '../../../../drive/models/drive';
import { AwsDirectoryBroker } from '../../../brokers/directories/aws-directory-broker';
import { Directory } from '../../../models/directory/directory';
import { DirectoryDescriptor } from '../../../models/file-descriptor/directory-descriptor';

export class AwsDirectoryService {
    constructor(private readonly broker: AwsDirectoryBroker) {}

    listDirectory(drive: Drive): Promise<DirectoryDescriptor> {
        throw new Error('not implemented');
    }

    makeDirectory(drive: Drive, directoryPath: string): Promise<Directory> {
        throw new Error('not implemented');
    }
}
