import { Drive } from '../../../../drive/models/drive';
import { File } from '../../../models/file/file';

export interface IAWSFileService {
    retrieveFileAsync(drive: Drive, filePath: string): Promise<File>;

    writeFileAsync(drive: Drive, file: File): Promise<File>;

    removeFileAsync(drive: Drive, file: File): Promise<File>;
}
