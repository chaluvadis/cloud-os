import { Exception } from '../src/libraries/exceptions';

declare global {
    namespace jest {
        interface Matchers<R> {
            toThrowException(expectedException: Exception): R;
        }
    }
}
