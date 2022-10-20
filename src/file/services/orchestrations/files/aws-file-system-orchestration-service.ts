import { Drive } from '../../../../drive/models/drive';
import { Directory } from '../../../models/directory/directory';
import { File } from '../../../models/file/file';
import { AWSDirectoryService } from '../../foundations/directories/aws-directory-service';
import { AWSFileService } from '../../foundations/files/aws-file-service';

export class AwsFileSystemOrchestrationService {
    constructor(
        private readonly fileService: AWSFileService,
        private readonly directoryService: AWSDirectoryService
    ) {}

    readFile(drive: Drive, filePath: string): Promise<File> {
        return this.fileService.retrieveFile(drive, filePath);
    }

    removeFile(drive: Drive, file: File): Promise<File> {
        return this.fileService.removeFile(drive, file);
    }

    writeFile(drive: Drive, file: File): Promise<File> {
        return this.fileService.writeFile(drive, file);
    }

    listFiles(drive: Drive, directoryPath: string): Promise<Directory> {
        return this.directoryService.retrieveDirectory(drive, directoryPath);
    }

    makeDirectory(drive: Drive, directory: Directory): Promise<Directory> {
        return this.directoryService.makeDirectory(drive, directory.path);
    }

    async removeDirectory(
        drive: Drive,
        directory: Directory
    ): Promise<Directory> {
        const rootFile = new File(directory.path, '');
        await this.fileService.removeFile(drive, rootFile);
        return new Directory(directory.path);
    }
}
