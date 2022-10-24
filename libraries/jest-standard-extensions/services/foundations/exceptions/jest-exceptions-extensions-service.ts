import { Exception } from '../../../../exceptions';
import { AssertionResult } from '../../../models/assertion-result/assertion-result';

export class JestExceptionsExtensionsService {
    assertActionThrowsExpectedException(
        action: unknown,
        expectedException: unknown
    ): AssertionResult {
        if (typeof action !== 'function') {
            return this.createAssertionResultForInvalidAction();
        }
        if (!(expectedException instanceof Exception)) {
            return this.createAssertionResultForInvalidException();
        }
        try {
            const result = action();
            if (result instanceof Promise) {
                return new AssertionResult(
                    "The action passed to 'expect(action).toThrowException(expectedException) returns a promise. Please use the pattern expect(action).toThrowExceptionAsync(expectedException) for async actions.'",
                    false
                );
            }
            return this.createAssertionResultWhenActionDoesNotThrow();
        } catch (error) {
            return this.compareExceptions(error, expectedException);
        }
    }

    private createAssertionResultForInvalidAction(): AssertionResult {
        return new AssertionResult(
            "Expected 'action' to be a function.",
            false
        );
    }

    private createAssertionResultForInvalidException(): AssertionResult {
        return new AssertionResult(
            "Expected 'expectedException' to be an Exception.",
            false
        );
    }

    private createAssertionResultWhenActionDoesNotThrow(): AssertionResult {
        return new AssertionResult(
            'Expected action to throw an exception.',
            false
        );
    }

    private compareExceptions(error: unknown, expectedException: Exception) {
        const caughtException = Exception.fromError(error);
        const [equal, details] =
            caughtException.equalsWithDetails(expectedException);
        return new AssertionResult(details, equal);
    }

    async assertActionThrowsExpectedExceptionAsync(
        asyncAction: unknown,
        expectedException: unknown
    ): Promise<AssertionResult> {
        if (typeof asyncAction !== 'function') {
            return this.createAssertionResultForInvalidAction();
        }
        if (!(expectedException instanceof Exception)) {
            return this.createAssertionResultForInvalidException();
        }
        try {
            await (asyncAction as any)();
            return this.createAssertionResultWhenActionDoesNotThrow();
        } catch (error) {
            return this.compareExceptions(
                error,
                expectedException as Exception
            );
        }
    }
}
