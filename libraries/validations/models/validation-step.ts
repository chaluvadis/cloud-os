import { ValidationRule } from './validation-rule';

export class ValidationStep {
    constructor(
        public readonly name: string,
        public readonly rule: ValidationRule
    ) {}
}
