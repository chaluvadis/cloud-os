import { Drive } from '../../../../drive/models/drive';
import { Directory } from '../../../models/directory/directory';
import { File } from '../../../models/file/file';
import { AWSDirectoryService } from '../../foundations/directories/aws-directory-service';
import { AWSFileService } from '../../foundations/files/aws-file-service';

export class AWSFileSystemOrchestrationService {
    constructor(
        private readonly fileService: AWSFileService,
        private readonly directoryService: AWSDirectoryService
    ) {}

    readFile(drive: Drive, filePath: string): Promise<File> {
        return this.fileService.retrieveFileAsync(drive, filePath);
    }

    removeFile(drive: Drive, file: File): Promise<File> {
        return this.fileService.removeFileAsync(drive, file);
    }

    writeFile(drive: Drive, file: File): Promise<File> {
        return this.fileService.writeFileAsync(drive, file);
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
        await this.fileService.removeFileAsync(drive, rootFile);
        return new Directory(directory.path);
    }
}
