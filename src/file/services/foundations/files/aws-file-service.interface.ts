import { Drive } from '../../../../drive/models/drive';
import { File } from '../../../models/file/file';

export interface IAWSFileService {
    retrieveFile(drive: Drive, filePath: string): Promise<File>;

    writeFile(drive: Drive, file: File): Promise<File>;

    removeFile(drive: Drive, file: File): Promise<File>;
}
