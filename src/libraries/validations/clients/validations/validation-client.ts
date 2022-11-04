import { Exception } from '../../../exceptions';
import { ValidationStep } from '../../models/validations/validation-step';
import { ValidationService } from '../../services/foundations/validations/validation-service';
import { IValidationClient } from './validation-client.interface';

export class ValidationClient implements IValidationClient {
    private readonly validationService: ValidationService;

    constructor() {
        this.validationService = new ValidationService();
    }

    validate(exception: Exception, validationStepList: ValidationStep[]) {
        this.validationService.validate(exception, validationStepList);
    }
}
