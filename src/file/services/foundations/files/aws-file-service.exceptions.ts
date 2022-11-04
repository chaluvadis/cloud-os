import { tryCatchAsync } from '../../../../libraries/exception-handling';
import { NullBodyException } from '../../../models/file/exceptions/null-body-exception';
import { AWSFileValidationException } from './exceptions/aws-file-validation-exception';
import { Action } from '../../../../core/types/action';
import { File } from '../../../models/file/file';
import { NullResponseException } from '../../../models/file/exceptions/null-response-exception';
import { NullDriveException } from '../../../../drive/models/exceptions/null-drive-exception';
import { NullFilePathException } from '../../../models/file/exceptions/null-file-path-exception';

export class AWSFileServiceExceptions {
    retriveFileAsync(logic: Action<Promise<File>>) {
        return tryCatchAsync(logic)
            .handle(
                [
                    NullBodyException,
                    NullResponseException,
                    NullDriveException,
                    NullFilePathException,
                ],
                (exception) => new AWSFileValidationException(exception)
            )
            .execute();
    }
}
