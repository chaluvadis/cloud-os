import {
    ListObjectsCommand,
    ListObjectsCommandOutput,
    PutObjectCommand,
    PutObjectCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Drive } from '../../../drive/models/drive';

export class AwsDirectoryBroker {
    constructor(private readonly s3Client: S3Client) {}

    listObjectsInDirectory(
        drive: Drive,
        directoryPath: string
    ): Promise<ListObjectsCommandOutput> {
        return this.s3Client.send(
            new ListObjectsCommand({
                Bucket: drive.name,
                Prefix: directoryPath,
            })
        );
    }

    putDirectory(
        drive: Drive,
        directoryPath: string
    ): Promise<PutObjectCommandOutput> {
        return this.s3Client.send(
            new PutObjectCommand({
                Bucket: drive.name,
                Key: directoryPath,
            })
        );
    }
}
