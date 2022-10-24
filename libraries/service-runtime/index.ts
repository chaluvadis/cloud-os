import { ServiceRuntimeClient } from './clients/service-runtime-client';
import { Executable } from './models/executable/executable';

const client = new ServiceRuntimeClient();

export function createFunctionRuntime<T>(executable: Executable<T>) {
    return client.createFunctionRuntime(executable);
}

export function createAsyncFunctionRuntime<T>(executable: Executable<Promise<T>>) {
    return client.createAsyncFunctionRuntime(executable);
}
