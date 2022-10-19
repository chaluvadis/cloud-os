import { _Object as AWSFile } from '@aws-sdk/client-s3';
import { Drive } from '../../../../drive/models/drive';
import { AwsDirectoryBroker } from '../../../brokers/directories/aws-directory-broker';
import { Directory } from '../../../models/directory/directory';

export class AwsDirectoryService {
    constructor(private readonly directoryBroker: AwsDirectoryBroker) {}

    async retrieveDirectory(
        drive: Drive,
        directoryPath: string
    ): Promise<Directory> {
        const response = await this.directoryBroker.listObjectsInDirectory(
            drive,
            directoryPath
        );
        return this.mapAWSFilesToDirectory(directoryPath, response.Contents!);
    }

    private mapAWSFilesToDirectory(
        rootPath: string,
        awsFileList: AWSFile[]
    ): Directory {
        const expandedRootPath = rootPath.split('/');
        const expandedFileKeys = awsFileList.map((awsFile) =>
            awsFile.Key!.split('/')
        );
        return new Directory(
            rootPath,
            this.parseFileNames(expandedRootPath, expandedFileKeys),
            this.parseSubdirectoryNames(expandedRootPath, expandedFileKeys)
        );
    }

    private parseFileNames(
        expandedRootPath: string[],
        expandedFileKeys: string[][]
    ) {
        return expandedFileKeys
            .filter((expandedAWSFileKey) =>
                this.isFileInDirectory(expandedRootPath, expandedAWSFileKey)
            )
            .map(this.getFileName);
    }

    private isFileInDirectory(
        expandedRootPath: string[],
        expandedAWSFileKey: string[]
    ) {
        return expandedRootPath.length === expandedAWSFileKey.length - 1;
    }

    private getFileName(awsFileKey: string[]) {
        return awsFileKey.pop() as string;
    }

    private parseSubdirectoryNames(
        expandedRootPath: string[],
        expandedFileKeys: string[][]
    ) {
        return expandedFileKeys
            .filter((expandedAWSFileKey) =>
                this.isSubdirectoryInDirectory(
                    expandedRootPath,
                    expandedAWSFileKey
                )
            )
            .map((expandedAWSFileKey) =>
                this.getSubdirectoryName(expandedAWSFileKey, expandedRootPath)
            )
            .reduce<string[]>((uniqueSubDirectories, subdirectoryName) => {
                if (uniqueSubDirectories.includes(subdirectoryName)) {
                    return uniqueSubDirectories;
                }
                return [...uniqueSubDirectories, subdirectoryName];
            }, []);
    }

    private isSubdirectoryInDirectory(
        expandedRootPath: string[],
        expandedAWSFileKey: string[]
    ) {
        return expandedAWSFileKey.length - 2 >= expandedRootPath.length;
    }

    private getSubdirectoryName(
        expandedAWSFileKey: string[],
        expandedRootPath: string[]
    ) {
        return expandedAWSFileKey
            .slice(expandedRootPath.length, expandedRootPath.length + 1)
            .join('');
    }

    makeDirectory(drive: Drive, directoryPath: string): Promise<Directory> {
        throw new Error('not implemented');
    }
}
