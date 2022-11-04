import { CatchHandler } from './catch-handler';
import { DefaultHandler } from './default-handler';
import { Function } from './function';

export class ExceptionHandlingChainActions<T> {
    constructor(
        public readonly handle: CatchHandler<T>,
        public readonly execute: Function<T>,
        public readonly catchAll: DefaultHandler<T>
    ) {}
}
