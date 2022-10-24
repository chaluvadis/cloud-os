import { Executable } from '../executable/executable';
import { Exceptionhandlers } from '../exception-handlers/exception-handlers';

export class ServiceRuntimeChain<T> {
    constructor(
        public readonly run: Executable<T>,
        public readonly exceptionHandler: Exceptionhandlers<T>
    ) {}
}
