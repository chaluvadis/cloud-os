import { _Object as AWSObject } from '@aws-sdk/client-s3';
import { Drive } from '../../../../drive/models/drive';
import { AWSDirectoryBroker } from '../../../brokers/directories/aws-directory-broker';
import { Directory } from '../../../models/directory/directory';
import { AWSDirectoryServiceOperations } from './aws-directory-service.operations';
import { AWSDirectoryServiceValidations } from './aws-directory-service.validations';

export class AWSDirectoryService {
    private readonly validations: AWSDirectoryServiceValidations;
    private readonly operations: AWSDirectoryServiceOperations;

    constructor(private readonly directoryBroker: AWSDirectoryBroker) {
        this.validations = new AWSDirectoryServiceValidations();
        this.operations = new AWSDirectoryServiceOperations();
    }

    retrieveDirectory(drive: Drive, directoryPath: string): Promise<Directory> {
        return this.operations.retrieveDirectory(async () => {
            this.validations.validateDrive(drive);
            this.validations.validateFilePath(directoryPath);
            const response = await this.directoryBroker.listObjectsInDirectory(
                drive,
                directoryPath
            );
            this.validations.validateAWSListObjectsResponse(response);
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
            this.validations.validateAWSObject(awsObject);
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
        return this.operations.makeDirectory(async () => {
            await this.directoryBroker.putDirectory(drive, directoryPath);
            return new Directory(directoryPath);
        });
    }
}
