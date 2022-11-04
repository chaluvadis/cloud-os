import { Exception } from '../exceptions';
import { ValidationClient } from './clients/validations/validation-client';
import { ValidationStep } from './models/validations/validation-step';

const client = new ValidationClient();

export function validate(
    exception: Exception,
    validationSteps: ValidationStep[]
): void {
    client.validate(exception, validationSteps);
}
