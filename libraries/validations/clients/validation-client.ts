import { Exception } from '../../exceptions';
import { ValidationStep } from '../models/validation-step';
import { ValidationService } from '../services/foundations/validation-service';

export class ValidationClient {
    private readonly validationService: ValidationService;

    constructor() {
        this.validationService = new ValidationService();
    }

    validate(exception: Exception, validationStepList: ValidationStep[]) {
        this.validationService.validate(exception, validationStepList);
    }
}
