import { tryCatchAsync } from '../../../../../libraries/exception-handling';
import { NullFileBodyException } from '../../../models/file/exceptions/null-file-body-exception';
import { AWSFileValidationException } from './exceptions/aws-file-validation-exception';
import { Action } from '../../../../core/types/action';
import { File } from '../../../models/file/file';

export class AWSFileServiceExceptions {
    retriveFileAsync(logic: Action<Promise<File>>) {
        return tryCatchAsync(logic)
            .handle(
                [NullFileBodyException],
                (exception) => new AWSFileValidationException(exception)
            )
            .execute();
    }
}
