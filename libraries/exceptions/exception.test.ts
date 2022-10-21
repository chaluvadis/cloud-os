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

    describe('throwIfContainsErrors', () => {
        test('Should not throw since when exception has no errors', () => {
            const exception = new Exception();

            exception.throwIfContainsErrors();
        });

        test('Should throw when the exception contains errors', () => {
            const exception = new Exception(
                '',
                null,
                new Map([['key', ['message']]])
            );

            const action = () => exception.throwIfContainsErrors();
            expect(action).toThrow();
        });
    });

    describe('addExceptionData', () => {
        test('Should not add any data when the exception data is null', () => {
            const inputExceptionData = null as any;
            const exception = new Exception();
            const expectedData = new Map<string, string[]>();

            exception.addExceptionData(inputExceptionData);

            expect(exception.data).toEqual(expectedData);
        });

        test('Should add data when the exception data is not null', () => {
            const inputExceptionData = new Map<string, string[]>([
                ['key2', ['message']],
            ]);
            const existingData = new Map<string, string[]>([
                ['key1', ['message']],
            ]);
            const exception = new Exception('', null, existingData);
            const expectedData = new Map<string, string[]>([
                ['key1', ['message']],
                ['key2', ['message']],
            ]);

            exception.addExceptionData(inputExceptionData);

            expect(exception.data).toEqual(expectedData);
        });
    });

    describe('addErrorMessages', () => {
        test('Should add error messages to the exception', () => {
            const exception = new Exception();
            const expectedData = new Map([['key', ['message']]]);

            exception.addErrorMessages('key', ['message']);

            expect(exception.data).toEqual(expectedData);
        });

        test('Should throw an exception when adding a duplicate key', () => {
            const exception = new Exception(
                '',
                null,
                new Map([['key', ['messages']]])
            );
            const inputKey = 'key';
            const expectedError = new Error(
                `Exception data already contains the key: ${inputKey}.`
            );

            const action = () =>
                exception.addErrorMessages(inputKey, ['message']);
            expect(action).toThrowError(expectedError);
        });
    });
});
