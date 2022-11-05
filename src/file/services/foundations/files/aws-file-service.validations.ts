import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Drive } from '../../../../drive/models/drive';
import { NullDriveException } from '../../../../drive/models/exceptions/null-drive-exception';
import { isNil } from '../../../../libraries/conditions';
import { NullBodyException } from '../../../models/file/exceptions/null-body-exception';
import { NullFileException } from '../../../models/file/exceptions/null-file-exception';
import { NullFilePathException } from '../../../models/file/exceptions/null-file-path-exception';
import { NullResponseException } from '../../../models/file/exceptions/null-response-exception';
import { File } from '../../../models/file/file';

export class AWSFileServiceValidations {
    validateFilePath(filePath: string) {
        if (isNil(filePath)) {
            throw new NullFilePathException();
        }
    }

    validateDrive(drive: Drive) {
        if (isNil(drive)) {
            throw new NullDriveException();
        }
    }

    validateRetrieveFileResponse(response: GetObjectCommandOutput) {
        if (isNil(response)) {
            throw new NullResponseException();
        }
        if (isNil(response.Body)) {
            throw new NullBodyException();
        }
    }

    validateFile(file: File) {
        if (isNil(file)) {
            throw new NullFileException();
        }
    }
}
