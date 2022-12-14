import { Drive } from '../../../../drive/models/drive';
import { Directory } from '../../../models/directory/directory';
import { File } from '../../../models/file/file';
import { IAWSDirectoryService } from '../../foundations/directories/aws-directory-service.interface';
import { IAWSFileService } from '../../foundations/files/aws-file-service.interface';
import { IAWSFileSystemOrchestrationService } from './aws-file-system-orchestration-service.interface';

export class AWSFileSystemOrchestrationService
    implements IAWSFileSystemOrchestrationService
{
    constructor(
        private readonly fileService: IAWSFileService,
        private readonly directoryService: IAWSDirectoryService
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
        throw new Error('method not implemented');
    }
}
