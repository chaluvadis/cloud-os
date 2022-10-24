import { Exception } from '../exceptions';
import { JestStandardExtensionsClient } from './clients/jest-standard-extensions-client';
import { Action } from './models/action/action';
import { AsyncAction } from './models/action/async-action';

const client = new JestStandardExtensionsClient();

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
