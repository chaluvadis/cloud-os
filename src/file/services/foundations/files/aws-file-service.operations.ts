import { createAsyncRuntime } from '../../../../libraries/service-runtime';
import { File } from '../../../models/file/file';
import { Action } from '../../../../core/types/action';
import { AWSFileServiceExceptionHandlers } from './aws-file-service.exceptions';
import { AWSFileServiceValidations } from './aws-file-service.validations';
import { BundleOperations } from '../../../../core/bundlers/bundle-operations';

const AWSFileServiceBundledOperations = BundleOperations<
    [AWSFileServiceExceptionHandlers, AWSFileServiceValidations]
>(AWSFileServiceExceptionHandlers, AWSFileServiceValidations);

export class AWSFileServiceOperations extends AWSFileServiceBundledOperations {
    createRetrieveFileAsyncRuntime(logic: Action<Promise<File>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler(this.retrieveFileExceptionHandlerAsync)
            .run();
    }

    createWriteFileAsyncRuntime(logic: Action<Promise<File>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler(this.writeFileExceptionHandlerAsync)
            .run();
    }

    createRemoveFileAsyncRuntime(logic: Action<Promise<File>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler(this.removeFileExceptionHandlerAsync)
            .run();
    }
}
