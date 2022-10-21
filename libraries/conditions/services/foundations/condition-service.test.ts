import { ConditionService } from './condition-service';

describe('Condition Service Test Suite', () => {
    const service = new ConditionService();

    describe('isNil', () => {
        test('Should be true when null', () => {
            const input = null;
            const expectedResult = true;

            const actualResult = service.isNil(input);

            expect(actualResult).toEqual(expectedResult);
        });

        test('Should be true when undefined', () => {
            const input = undefined;
            const expectedResult = true;

            const actualResult = service.isNil(input);

            expect(actualResult).toEqual(expectedResult);
        });

        test('Should be false when defined', () => {
            const input = 10;
            const expectedResult = false;

            const actualResult = service.isNil(input);

            expect(actualResult).toEqual(expectedResult);
        });
    });
});
