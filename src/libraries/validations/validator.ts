import { Exception } from '../exceptions/exception';
import { ValidationStep } from './models/validation-step';

export class Validator {
    public static validate(
        exception: Exception,
        validationSteps: ValidationStep[]
    ) {
        validationSteps.forEach(({ rule, name }) => {
            if (rule.condition) {
                exception.upsertDataList(name, rule.message);
            }
        });
        exception.throwIfContainsErrors();
    }
}
