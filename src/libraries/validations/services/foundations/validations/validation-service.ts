import { Exception } from '../../../../exceptions';
import { ValidationStep } from '../../../models/validations/validation-step';
import { IValidationService } from './validation-service.interface';

export class ValidationService implements IValidationService {
    validate(exception: Exception, validationStepList: ValidationStep[]) {
        validationStepList.forEach(({ rule, name }) => {
            if (rule.condition) {
                exception.upsertDataList(name, rule.message);
            }
        });
        exception.throwIfContainsErrors();
    }
}
