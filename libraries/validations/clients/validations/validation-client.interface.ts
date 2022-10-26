import { Exception } from '../../../exceptions';
import { ValidationStep } from '../../models/validations/validation-step';

export interface IValidationClient {
    validate(exception: Exception, validationStepList: ValidationStep[]): void;
}
