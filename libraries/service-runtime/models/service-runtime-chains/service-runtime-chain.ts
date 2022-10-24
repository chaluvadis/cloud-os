import { Executable } from '../executable/executable';
import { ExceptionHandler } from '../exception-handlers/exception-handler';

export class ServiceRuntimeChain<T> {
    constructor(
        public readonly run: Executable<T>,
        public readonly exceptionHandler: ExceptionHandler<T>
    ) {}
}
