import {
    DeleteObjectCommandOutput,
    GetObjectCommandOutput,
    PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { Drive } from '../../../drive/models/drive';
import { File } from '../../models/file/file';
import { IFileBroker } from './file-broker.interface';

export interface IAWSFileBroker extends IFileBroker {
    getFile(drive: Drive, filePath: string): Promise<GetObjectCommandOutput>;

    deleteFile(drive: Drive, file: File): Promise<DeleteObjectCommandOutput>;

    putFile(drive: Drive, file: File): Promise<PutObjectCommandOutput>;
}
