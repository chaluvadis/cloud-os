import { Action } from '../../../../core/types/action';
import { createAsyncRuntime } from '../../../../libraries/service-runtime';
import { Directory } from '../../../models/directory/directory';
import { AWSDirectoryServiceExceptions } from './aws-directory-service.exceptions';

export class AWSDirectoryServiceOperations {
    private readonly exceptions: AWSDirectoryServiceExceptions;

    constructor() {
        this.exceptions = new AWSDirectoryServiceExceptions();
    }

    retrieveDirectory(logic: Action<Promise<Directory>>): Promise<Directory> {
        return createAsyncRuntime(logic)
            .exceptionHandler(this.exceptions.retrieveDirectory)
            .run();
    }

    makeDirectory(logic: Action<Promise<Directory>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler(this.exceptions.makeDirectory)
            .run();
    }
}
