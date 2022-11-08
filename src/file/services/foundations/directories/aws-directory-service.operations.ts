import { BundleOperations } from '../../../../core/bundlers/bundle-operations';
import { Action } from '../../../../core/types/action';
import { createAsyncRuntime } from '../../../../libraries/service-runtime';
import { Directory } from '../../../models/directory/directory';
import { AWSDirectoryServiceExceptionHandlers } from './aws-directory-service.exceptions';
import { AWSDirectoryServiceValidations } from './aws-directory-service.validations';

export class AWSDirectoryServiceOperations extends BundleOperations(
    AWSDirectoryServiceExceptionHandlers,
    AWSDirectoryServiceValidations
) {
    createRetrieveDirectoryAsyncRuntime(
        logic: Action<Promise<Directory>>
    ): Promise<Directory> {
        return createAsyncRuntime(logic)
            .exceptionHandler(this.retrieveDirectoryExceptionHandlerAsync)
            .run();
    }

    createMakeDirectoryAsyncRuntime(logic: Action<Promise<Directory>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler(this.makeDirectoryExceptionHandlerAsync)
            .run();
    }
}
