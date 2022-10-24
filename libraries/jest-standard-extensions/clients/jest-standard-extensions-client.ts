import { AssertionResult } from '../models/assertion-result/assertion-result';
import { JestExceptionsExtensionsService } from '../services/foundations/exceptions/jest-exceptions-extensions-service';

export class JestStandardExtensionsClient {
    private readonly jestExceptionsExtensionsService: JestExceptionsExtensionsService;

    constructor() {
        this.jestExceptionsExtensionsService =
            new JestExceptionsExtensionsService();
    }

    assertActionThrowsExpectedException(
        action: unknown,
        expectedException: unknown
    ): AssertionResult {
        return this.jestExceptionsExtensionsService.assertActionThrowsExpectedException(
            action,
            expectedException
        );
    }

    assertActionThrowsExpectedExceptionAsync(
        asyncAction: unknown,
        expectedException: unknown
    ): Promise<AssertionResult> {
        return this.jestExceptionsExtensionsService.assertActionThrowsExpectedExceptionAsync(
            asyncAction,
            expectedException
        );
    }
}
