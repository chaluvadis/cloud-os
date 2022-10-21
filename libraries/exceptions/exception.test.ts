import { Exception } from './exception';

describe('Exception Test Suite', () => {
    describe('fromError', () => {
        test('Should return itself when the error is an exception', () => {
            const inputError = new Exception();
            const expectedError = new Exception();

            const actualError = Exception.fromError(inputError);

            expect(actualError.equals(expectedError)).toBeTruthy();
        });

        test('Should return a new exception when the error is an error', () => {
            const inputError = new Error('message');
            const expectedError = new Exception('message', inputError);

            const actualError = Exception.fromError(inputError);

            expect(actualError.equals(expectedError)).toBeTruthy();
        });

        test('Should return an exception with a message when the error is a symbol', () => {
            const inputError = Symbol.for('error');
            const expectedError = new Exception('Symbol(error)');

            const actualError = Exception.fromError(inputError);

            expect(actualError.equals(expectedError)).toBeTruthy();
        });

        test('Should return an exception with a message when the error is a string', () => {
            const inputError = 'error';
            const expectedError = new Exception('error');

            const actualError = Exception.fromError(inputError);

            expect(actualError.equals(expectedError)).toBeTruthy();
        });

        test('Should return an exception with a message when the error is anything else', () => {
            const inputError = [];
            const expectedError = new Exception(String([]));

            const actualError = Exception.fromError(inputError);

            expect(actualError.equals(expectedError)).toBeTruthy();
        });
    });
});
