import { Directory } from '../models/directory';
import { File } from '../models/file';
import { FileDescriptor } from '../models/file-descriptor';

export class FileClient {
    deleteDirectory(driveName: string, filePath: string): Promise<Directory> {}

    deleteFile(driveName: string, filePath: string): Promise<File> {}

    listDirectory(driveName: string, filePath: string): Promise<FileDescriptor[]> {}

    readFile(driveName: string, filePath: string): Promise<File> {}

    createDirectory(driveName: string, filePath: string): Promise<Directory> {}

    writeFile(driveName: string, filePath: string): Promise<File> {}
}
