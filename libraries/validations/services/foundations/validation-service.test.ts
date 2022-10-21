import { Exception } from '../../../exceptions';
import { ValidationRule } from '../../models/validation-rule';
import { ValidationStep } from '../../models/validation-step';
import { ValidationService } from './validation-service';

describe('Validation Service Test Suite', () => {
    const service = new ValidationService();

    describe('validate', () => {
        test('Should not throw an exception when the validation is successful', () => {
            const exception = new Exception();
            const validationStepList = [
                new ValidationStep('x', new ValidationRule(false, 'Success!')),
            ];

            service.validate(exception, validationStepList);
        });

        test('Should not throw an exception when the validation is unsuccessful', () => {
            const exception = new Exception();
            const validationStepList = [
                new ValidationStep('x', new ValidationRule(false, 'Success!')),
                new ValidationStep('y', new ValidationRule(true, 'Failed!')),
            ];
            const expectedException = exception;

            const action = () =>
                service.validate(exception, validationStepList);
            expect(action).toThrowException(expectedException);
        });
    });
});
