export class ValidationRule {
    constructor(
        public readonly condition: boolean,
        public readonly message: string
    ) {}
}
