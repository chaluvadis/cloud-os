import { Exception } from '../exceptions';
import { JestExceptionExtensionsClient } from './clients/exceptions/jest-exceptions-extensions-client';
import { Action } from './models/action/action';
import { AsyncAction } from './models/action/async-action';

const client = new JestExceptionExtensionsClient();

expect.extend({
    toThrowException(action: Action, expectedException: Exception) {
        const assertion = client.assertActionThrowsExpectedException(
            action,
            expectedException
        );
        return {
            message: () => assertion.message,
            pass: assertion.success,
        };
    },
    async toThrowExceptionAsync(
        action: AsyncAction,
        expectedException: Exception
    ) {
        const assertion = await client.assertActionThrowsExpectedExceptionAsync(
            action,
            expectedException
        );
        return {
            message: () => assertion.message,
            pass: assertion.success,
        };
    },
});
