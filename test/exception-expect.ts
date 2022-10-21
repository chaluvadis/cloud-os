import { Exception } from '../libraries/exceptions';

type TestAction = () => any;

expect.extend({
    async toThrowException(
        func: TestAction | Error,
        expectedException: Exception
    ) {
        try {
            if (func instanceof Error) {
                throw func;
            } else {
                await func();
                return {
                    message: () => 'Expected function to throw',
                    pass: false,
                };
            }
        } catch (error) {
            const actualException = Exception.fromError(error);
            return {
                message() {
                    if (actualException.name !== expectedException.name) {
                        return `Expected exception with name "${expectedException.name}". Was "${actualException.name}".`;
                    }
                    if (actualException.message !== expectedException.message) {
                        return `Expected exception with message "${expectedException.message}". Was "${actualException.message}".`;
                    }
                    const [, message] = expectedException.dataEqualsWithDetails(
                        actualException.data
                    );
                    return message;
                },
                pass: expectedException.equals(actualException),
            };
        }
    },
});
