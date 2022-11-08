import { createAsyncRuntime } from '../../../../libraries/service-runtime';
import { File } from '../../../models/file/file';
import { Action } from '../../../../core/types/action';
import { AWSFileServiceExceptionHandlers } from './aws-file-service.exceptions';
import { AWSFileServiceValidations } from './aws-file-service.validations';
import { BundleOperations } from '../../../../core/bundlers/bundle-operations';

export class AWSFileServiceOperations extends BundleOperations<
    [AWSFileServiceExceptionHandlers, AWSFileServiceValidations]
>(AWSFileServiceExceptionHandlers, AWSFileServiceValidations) {
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
