import { AsyncFunction } from './async-function';
import { CatchHandler } from './catch-handler';

export class ExceptionHandlingChainActionsAsync<T> {
    constructor(
        public readonly handle: CatchHandler<Promise<T>>,
        public readonly execute: AsyncFunction<T>
    ) {}
}
