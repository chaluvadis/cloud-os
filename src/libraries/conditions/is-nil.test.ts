import { isNil } from './is-nil';

describe('isNil Test Suite', () => {
    test('Should be true when null', () => {
        const input = null;
        const expectedResult = true;

        const actualResult = isNil(input);

        expect(actualResult).toEqual(expectedResult);
    });

    test('Should be true when undefined', () => {
        const input = undefined;
        const expectedResult = true;

        const actualResult = isNil(input);

        expect(actualResult).toEqual(expectedResult);
    });

    test('Should be false when defined', () => {
        const input = 10;
        const expectedResult = false;

        const actualResult = isNil(input);

        expect(actualResult).toEqual(expectedResult);
    });
});
