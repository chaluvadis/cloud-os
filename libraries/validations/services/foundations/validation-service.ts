import { Exception } from '../../../exceptions';
import { ValidationStep } from '../../models/validation-step';

export class ValidationService {
    validate(exception: Exception, validationStepList: ValidationStep[]) {
        validationStepList.forEach(({ rule, name }) => {
            if (rule.condition) {
                exception.upsertDataList(name, rule.message);
            }
        });
        exception.throwIfContainsErrors();
    }
}
