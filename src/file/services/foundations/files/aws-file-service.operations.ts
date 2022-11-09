import { createAsyncRuntime } from '../../../../libraries/service-runtime';
import { File } from '../../../models/file/file';
import { Action } from '../../../../core/types/action';
import { AWSFileServiceExceptionHandlers } from './aws-file-service.exceptions';
import { AWSFileServiceValidations } from './aws-file-service.validations';
import { BundleOperations } from '../../../../core/bundlers/bundle-operations';
import { IAWSFileBroker } from '../../../brokers/files/aws-file-broker.interface';

export class AWSFileServiceOperations extends BundleOperations(
    AWSFileServiceExceptionHandlers,
    AWSFileServiceValidations
) {
    constructor(protected readonly fileBroker: IAWSFileBroker) {
        super(arguments);
    }

    createRetrieveFileAsyncRuntime(logic: Action<Promise<File>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler((logic) =>
                this.retrieveFileExceptionHandlerAsync(logic)
            )
            .run();
    }

    createWriteFileAsyncRuntime(logic: Action<Promise<File>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler((logic) =>
                this.writeFileExceptionHandlerAsync(logic)
            )
            .run();
    }

    createRemoveFileAsyncRuntime(logic: Action<Promise<File>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler((logic) =>
                this.removeFileExceptionHandlerAsync(logic)
            )
            .run();
    }
}
