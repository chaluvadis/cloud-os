import { createAsyncRuntime } from '../../../../libraries/service-runtime';
import { AWSFileServiceExceptions } from './aws-file-service.exceptions';
import { File } from '../../../models/file/file';
import { Action } from '../../../../core/types/action';

export class AWSFileServiceOperations {
    private readonly exceptions: AWSFileServiceExceptions;

    constructor() {
        this.exceptions = new AWSFileServiceExceptions();
    }

    retriveFileAsync(logic: Action<Promise<File>>) {
        return createAsyncRuntime(logic)
            .exceptionHandler(this.exceptions.retriveFileAsync)
            .run();
    }
}
