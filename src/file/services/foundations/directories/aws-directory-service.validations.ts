import {
    ListObjectsCommandOutput,
    _Object as AWSObject,
} from '@aws-sdk/client-s3';
import { Drive } from '../../../../drive/models/drive';
import { NullDriveException } from '../../../../drive/models/exceptions/null-drive-exception';
import { isNil } from '../../../../libraries/conditions';
import { validate } from '../../../../libraries/validations';
import { ValidationRule } from '../../../../libraries/validations/models/validations/validation-rule';
import { ValidationStep } from '../../../../libraries/validations/models/validations/validation-step';
import { NullDirectoryContentsException } from '../../../models/directory/exceptions/null-directory-contents-exception';
import { IllegalFilePathException } from '../../../models/file/exceptions/illegal-file-path-exception';
import { NullFilePathException } from '../../../models/file/exceptions/null-file-path-exception';

export class AWSDirectoryServiceValidations {
    validateAWSObject(awsObject: AWSObject) {
        if (isNil(awsObject.Key)) {
            throw new NullFilePathException();
        }
    }

    validateAWSListObjectsResponse(response: ListObjectsCommandOutput) {
        if (isNil(response.Contents)) {
            throw new NullDirectoryContentsException();
        }
    }

    validateDrive(drive: Drive) {
        if (isNil(drive)) {
            throw new NullDriveException();
        }
    }

    validateFilePath(filePath: string) {
        if (isNil(filePath)) {
            throw new NullFilePathException();
        }
        validate(
            new IllegalFilePathException(),
            this.createFilePathValidationSteps(filePath)
        );
    }

    private createFilePathValidationSteps(filePath: string) {
        return [
            new ValidationStep(
                'path',
                new ValidationRule(
                    filePath.startsWith('.'),
                    `File path must be absolute. Received relative file path "${filePath}"`
                )
            ),
        ];
    }
}
