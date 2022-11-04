import { AsyncFunction } from './async-function';
import { CatchHandler } from './catch-handler';
import { DefaultHandler } from './default-handler';

export class AsyncExceptionHandlingChainActions<T> {
    constructor(
        public readonly handle: CatchHandler<Promise<T>>,
        public readonly execute: AsyncFunction<T>,
        public readonly catchAll: DefaultHandler<Promise<T>>
    ) {}
}
