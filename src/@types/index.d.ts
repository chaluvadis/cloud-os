import { Exception } from '../../libraries/exceptions';

declare global {
    namespace jest {
        interface Matchers<R> {
            toThrowException(expectedException: Exception): R;
            toThrowExceptionAsync(expectedException: Exception): Promise<R>;
        }
    }
}

export {};