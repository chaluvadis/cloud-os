import { ConditionService } from '../services/foundations/condition-service';

export class ConditionClient {
    private readonly conditionService: ConditionService;

    constructor() {
        this.conditionService = new ConditionService();
    }

    isNil(x: unknown): x is null | undefined {
        return this.conditionService.isNil(x);
    }
}
