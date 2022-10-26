import { IConditionService } from './condition-service.interface';

export class ConditionService implements IConditionService {
    isNil(x: unknown): x is null | undefined {
        return x === undefined || x === null;
    }
}
