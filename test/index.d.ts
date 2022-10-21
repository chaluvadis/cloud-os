import { Exception } from '../src/libraries/exceptions/exception';

declare global {
    namespace jest {
        interface Matchers<R> {
            toThrowException(expectedException: Exception): R;
        }
    }
}
