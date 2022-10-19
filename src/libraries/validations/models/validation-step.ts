import { ValidationRule } from './validation-rule';

export interface ValidationStep {
    name: string;
    rule: ValidationRule;
}
