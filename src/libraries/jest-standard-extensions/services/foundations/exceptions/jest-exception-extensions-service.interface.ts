import { AssertionResult } from '../../../models/assertion-result/assertion-result';

export interface IJestExceptionExtensionsService {
    assertActionThrowsExpectedException(
        action: unknown,
        expectedException: unknown
    ): AssertionResult;

    assertActionThrowsExpectedExceptionAsync(
        asyncAction: unknown,
        expectedException: unknown
    ): Promise<AssertionResult>;
}
