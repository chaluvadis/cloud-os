import { BundleOperations } from '../../../../core/bundlers/bundle-operations';
import { Action } from '../../../../core/types/action';
import { createAsyncRuntime } from '../../../../libraries/service-runtime';
import { IAWSDirectoryBroker } from '../../../brokers/directories/aws-directory-broker.interface';
import { Directory } from '../../../models/directory/directory';
import { AWSDirectoryServiceExceptionHandlers } from './aws-directory-service.exceptions';
import { AWSDirectoryServiceValidations } from './aws-directory-service.validations';

export class AWSDirectoryServiceOperations extends BundleOperations(
    AWSDirectoryServiceExceptionHandlers,
    AWSDirectoryServiceValidations
) {
    constructor(protected readonly directoryBroker: IAWSDirectoryBroker) {
        super(arguments);
    }

    createRetrieveDirectoryAsyncRuntime(
        logic: Action<Promise<Directory>>
    ): Promise<Directory> {
        return createAsyncRuntime(logic)
            .exceptionHandler((logic) =>
                this.retrieveDirectoryExceptionHandlerAsync(logic)
            )
            .run();
    }

    createMakeDirectoryAsyncRuntime(logic: Action<Promise<Directory>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler((logic) =>
                this.makeDirectoryExceptionHandlerAsync(logic)
            )
            .run();
    }
}
