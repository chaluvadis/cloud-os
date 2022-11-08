import { createAsyncRuntime } from '../../../../libraries/service-runtime';
import { File } from '../../../models/file/file';
import { Action } from '../../../../core/types/action';
import { AWSFileServiceExceptions } from './aws-file-service.exceptions';

export class AWSFileServiceOperations {
    private readonly exceptions: AWSFileServiceExceptions;

    constructor() {
        this.exceptions = new AWSFileServiceExceptions();
    }

    retriveFileAsync(logic: Action<Promise<File>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler(this.exceptions.retrieveFileAsync)
            .run();
    }

    writeFileAsync(logic: Action<Promise<File>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler(this.exceptions.writeFileAsync)
            .run();
    }

    removeFileAsync(logic: Action<Promise<File>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler(this.exceptions.removeFileAsync)
            .run();
    }
}
