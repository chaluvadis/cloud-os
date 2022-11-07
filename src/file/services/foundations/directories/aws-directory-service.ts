import { _Object as AWSObject } from '@aws-sdk/client-s3';
import { Drive } from '../../../../drive/models/drive';
import { tryCatchAsync } from '../../../../libraries/exception-handling';
import { AWSDirectoryBroker } from '../../../brokers/directories/aws-directory-broker';
import { Directory } from '../../../models/directory/directory';
import { NullDirectoryContentsException } from '../../../models/directory/exceptions/null-directory-contents-exception';
import { NullFilePathException } from '../../../models/file/exceptions/null-file-path-exception';
import { AWSDirectoryServiceValidations } from './aws-directory-service.validations';
import { AWSDirectoryValidationException } from './exceptions/aws-directory-validation-exception';

export class AWSDirectoryService {
    private readonly validations: AWSDirectoryServiceValidations;

    constructor(private readonly directoryBroker: AWSDirectoryBroker) {
        this.validations = new AWSDirectoryServiceValidations();
    }

    retrieveDirectory(drive: Drive, directoryPath: string): Promise<Directory> {
        return tryCatchAsync(async () => {
            const response = await this.directoryBroker.listObjectsInDirectory(
                drive,
                directoryPath
            );
            this.validations.validateAWSListObjectsResponse(response);
            return this.mapAWSObjectsToDirectory(
                directoryPath,
                response.Contents as AWSObject[]
            );
        })
            .handle(
                [NullDirectoryContentsException, NullFilePathException],
                (exception) => new AWSDirectoryValidationException(exception)
            )
            .execute();
    }

    private mapAWSObjectsToDirectory(
        rootPath: string,
        awsObjectList: AWSObject[]
    ): Directory {
        const expandedRootPath = rootPath.split('/');
        const expandedKeys = awsObjectList.map((awsObject) => {
            this.validations.validateAWSObject(awsObject);
            return awsObject.Key!.split('/');
        });
        return new Directory(
            rootPath,
            this.parseFileNames(expandedRootPath, expandedKeys),
            this.parseSubdirectoryNames(expandedRootPath, expandedKeys)
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

    async makeDirectory(
        drive: Drive,
        directoryPath: string
    ): Promise<Directory> {
        await this.directoryBroker.putDirectory(drive, directoryPath);
        return new Directory(directoryPath);
    }
}
