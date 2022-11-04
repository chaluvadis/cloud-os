import { ServiceRuntimeClient } from './clients/service-runtimes/service-runtime-client';
import { Executable } from './models/executable/executable';

const client = new ServiceRuntimeClient();

export function createRuntime<T>(executable: Executable<T>) {
    return client.createRuntime<T>(executable);
}

export function createAsyncRuntime<T>(executable: Executable<Promise<T>>) {
    return client.createAsyncRuntime<T>(executable);
}
