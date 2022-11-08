import { Drive } from '../../../../drive/models/drive';
import { Directory } from '../../../models/directory/directory';
import { File } from '../../../models/file/file';

export interface IAWSFileSystemOrchestrationService {
    readFile(drive: Drive, filePath: string): Promise<File>;

    removeFile(drive: Drive, file: File): Promise<File>;

    writeFile(drive: Drive, file: File): Promise<File>;

    listFiles(drive: Drive, directoryPath: string): Promise<Directory>;

    makeDirectory(drive: Drive, directory: Directory): Promise<Directory>;

    removeDirectory(drive: Drive, directory: Directory): Promise<Directory>;
}
