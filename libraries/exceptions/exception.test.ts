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

    describe('upsertDataList', () => {
        test('Should add a message to a key', () => {
            const inputKey = 'key';
            const inputValue = 'value';
            const expectedKey = inputKey;
            const expectedValues = [inputValue];
            const exception = new Exception();

            exception.upsertDataList(inputKey, inputValue);

            expect(exception.data.has(expectedKey)).toBeTruthy();
            expect(exception.data.get(expectedKey)).toEqual(expectedValues);
        });

        test('Should create a new key in the data and add a message', () => {
            const inputKey = 'key';
            const inputValue = 'valueC';
            const existingValues = ['valueA', 'valueB'];
            const expectedKey = inputKey;
            const expectedValues = [...existingValues, inputValue];
            const exception = new Exception(
                '',
                null,
                new Map([[inputKey, existingValues]])
            );

            exception.upsertDataList(inputKey, inputValue);

            expect(exception.data.has(expectedKey)).toBeTruthy();
            expect(exception.data.get(expectedKey)).toEqual(expectedValues);
        });
    });
});
