import { ConditionService } from '../../services/foundations/conditions/condition-service';
import { IConditionClient } from './condition-client.interface';

export class ConditionClient implements IConditionClient {
    private readonly conditionService: ConditionService;

    constructor() {
        this.conditionService = new ConditionService();
    }

    isNil(x: unknown): x is null | undefined {
        return this.conditionService.isNil(x);
    }
}
