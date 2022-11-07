import { Action } from '../../../../core/types/action';
import { NullDriveException } from '../../../../drive/models/exceptions/null-drive-exception';
import { tryCatchAsync } from '../../../../libraries/exception-handling';
import { Directory } from '../../../models/directory/directory';
import { NullDirectoryContentsException } from '../../../models/directory/exceptions/null-directory-contents-exception';
import { IllegalFilePathException } from '../../../models/file/exceptions/illegal-file-path-exception';
import { NullFilePathException } from '../../../models/file/exceptions/null-file-path-exception';
import { AWSDirectoryValidationException } from './exceptions/aws-directory-validation-exception';

export class AWSDirectoryServiceExceptions {
    retrieveDirectory(logic: Action<Promise<Directory>>): Promise<Directory> {
        return tryCatchAsync(logic)
            .handle(
                [
                    NullDirectoryContentsException,
                    NullFilePathException,
                    NullDriveException,
                    IllegalFilePathException,
                ],
                (exception) => new AWSDirectoryValidationException(exception)
            )
            .execute();
    }

    makeDirectory(logic: Action<Promise<Directory>>): Promise<Directory> {
        return tryCatchAsync(logic).execute();
    }
}
