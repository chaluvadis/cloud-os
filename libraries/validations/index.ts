import { Exception } from '../exceptions';
import { ValidationClient } from './clients/validation-client';
import { ValidationStep } from './models/validation-step';

const client = new ValidationClient();

export function validate(
    exception: Exception,
    validationSteps: ValidationStep[]
): void {
    client.validate(exception, validationSteps);
}
