import { AsyncFunction } from './async-function';
import { CatchHandler } from './catch-handler';
import { Function } from './function';

export class ExceptionHandlingChainActions<T> {
    constructor(
        public readonly handle: CatchHandler<T>,
        public readonly execute: Function<T> | AsyncFunction<T>
    ) {}
}
