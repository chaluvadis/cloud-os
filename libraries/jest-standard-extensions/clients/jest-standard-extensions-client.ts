import { Exception } from '../../exceptions';
import { Action } from '../models/action/action';
import { AsyncAction } from '../models/action/async-action';
import { AssertionResult } from '../models/assertion-result/assertion-result';
import { JestExceptionsExtensionsService } from '../services/foundations/exceptions/jest-exceptions-extensions-service';

export class JestStandardExtensionsClient {
    private readonly jestExceptionsExtensionsService: JestExceptionsExtensionsService;

    constructor() {
        this.jestExceptionsExtensionsService =
            new JestExceptionsExtensionsService();
    }

    assertActionThrowsExpectedException(
        action: Action,
        expectedException: Exception
    ): AssertionResult {
        return this.jestExceptionsExtensionsService.assertActionThrowsExpectedException(
            action,
            expectedException
        );
    }

    assertActionThrowsExpectedExceptionAsync(
        asyncAction: AsyncAction,
        expectedException: Exception
    ): Promise<AssertionResult> {
        return this.jestExceptionsExtensionsService.assertActionThrowsExpectedExceptionAsync(
            asyncAction,
            expectedException
        );
    }
}
