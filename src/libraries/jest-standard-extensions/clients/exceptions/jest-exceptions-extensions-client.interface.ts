import { Exception } from '../../../exceptions';
import { Action } from '../../models/action/action';
import { AsyncAction } from '../../models/action/async-action';
import { AssertionResult } from '../../models/assertion-result/assertion-result';

export interface IJestExceptionsExtensionsClient {
    assertActionThrowsExpectedException(
        action: Action,
        expectedException: Exception
    ): AssertionResult;

    assertActionThrowsExpectedExceptionAsync(
        asyncAction: AsyncAction,
        expectedException: Exception
    ): Promise<AssertionResult>;
}
