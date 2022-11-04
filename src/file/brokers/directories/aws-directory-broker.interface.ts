import {
    ListObjectsCommandOutput,
    PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { Drive } from '../../../drive/models/drive';
import { IDirectoryBroker } from './directory-broker.interface';

export interface IAWSDirectoryBroker extends IDirectoryBroker {
    listObjectsInDirectory(
        drive: Drive,
        directoryPath: string
    ): Promise<ListObjectsCommandOutput>;

    putDirectory(
        drive: Drive,
        directoryPath: string
    ): Promise<PutObjectCommandOutput>;
}
