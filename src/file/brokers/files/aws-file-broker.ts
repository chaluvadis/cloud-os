import {
    DeleteObjectCommandOutput,
    PutObjectCommandOutput,
    GetObjectCommand,
    GetObjectCommandOutput,
    S3Client,
    DeleteObjectCommand,
    PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Drive } from '../../../drive/models/drive';
import { File } from '../../models/file/file';
import { IAWSFileBroker } from './aws-file-broker.interface';

export class AWSFileBroker implements IAWSFileBroker {
    constructor(private readonly s3Client: S3Client) {}

    getReadableFileContent(
        drive: Drive,
        filePath: string
    ): Promise<GetObjectCommandOutput> {
        return this.s3Client.send(
            new GetObjectCommand({
                Bucket: drive.name,
                Key: filePath,
            })
        );
    }

    deleteFile(drive: Drive, file: File): Promise<DeleteObjectCommandOutput> {
        return this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: drive.name,
                Key: file.path,
            })
        );
    }

    putFile(drive: Drive, file: File): Promise<PutObjectCommandOutput> {
        return this.s3Client.send(
            new PutObjectCommand({
                Bucket: drive.name,
                Key: file.path,
                Body: file.content,
            })
        );
    }
}
