import { Exception } from '../../../exceptions';
import { Action } from '../../models/action/action';
import { AsyncAction } from '../../models/action/async-action';
import { AssertionResult } from '../../models/assertion-result/assertion-result';
import { JestExceptionExtensionsService } from '../../services/foundations/exceptions/jest-exception-extensions-service';
import { IJestExceptionsExtensionsClient } from './jest-exceptions-extensions-client.interface';

export class JestExceptionExtensionsClient
    implements IJestExceptionsExtensionsClient
{
    private readonly jestExceptionExtensionsService: JestExceptionExtensionsService;

    constructor() {
        this.jestExceptionExtensionsService =
            new JestExceptionExtensionsService();
    }

    assertActionThrowsExpectedException(
        action: Action,
        expectedException: Exception
    ): AssertionResult {
        return this.jestExceptionExtensionsService.assertActionThrowsExpectedException(
            action,
            expectedException
        );
    }

    assertActionThrowsExpectedExceptionAsync(
        asyncAction: AsyncAction,
        expectedException: Exception
    ): Promise<AssertionResult> {
        return this.jestExceptionExtensionsService.assertActionThrowsExpectedExceptionAsync(
            asyncAction,
            expectedException
        );
    }
}
