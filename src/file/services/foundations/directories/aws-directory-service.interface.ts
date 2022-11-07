import { Drive } from '../../../../drive/models/drive';
import { Directory } from '../../../models/directory/directory';

export interface IAWSDirectoryService {
    retrieveDirectory(drive: Drive, directoryPath: string): Promise<Directory>;
    makeDirectory(drive: Drive, directoryPath: string): Promise<Directory>;
}
