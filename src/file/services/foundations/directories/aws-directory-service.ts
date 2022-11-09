import { _Object as AWSObject } from '@aws-sdk/client-s3';
import { Drive } from '../../../../drive/models/drive';
import { IAWSDirectoryBroker } from '../../../brokers/directories/aws-directory-broker.interface';
import { Directory } from '../../../models/directory/directory';
import { AWSDirectoryServiceOperations } from './aws-directory-service.operations';

export class AWSDirectoryService extends AWSDirectoryServiceOperations {
    constructor(directoryBroker: IAWSDirectoryBroker) {
        super(directoryBroker);
    }

    retrieveDirectory(drive: Drive, directoryPath: string): Promise<Directory> {
        return this.createRetrieveDirectoryAsyncRuntime(async () => {
            this.validateDrive(drive);
            this.validateFilePath(directoryPath);
            const response = await this.directoryBroker.listObjectsInDirectory(
                drive,
                directoryPath
            );
            this.validateAWSListObjectsResponse(response);
            return this.mapAWSObjectsToDirectory(
                directoryPath,
                response.Contents as AWSObject[]
            );
        });
    }

    private mapAWSObjectsToDirectory(
        rootPath: string,
        awsFileList: AWSObject[]
    ): Directory {
        const expandedRootPath = rootPath.split('/');
        const expandedFileKeys = awsFileList.map((awsObject) => {
            this.validateAWSObject(awsObject);
            return awsObject.Key!.split('/');
        });
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
        return this.createMakeDirectoryAsyncRuntime(async () => {
            this.validateDrive(drive);
            this.validateFilePath(directoryPath);
            await this.directoryBroker.putDirectory(drive, directoryPath);
            return new Directory(directoryPath);
        });
    }
}
