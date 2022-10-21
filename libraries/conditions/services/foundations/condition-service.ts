export class ConditionService {
    isNil(x: unknown): x is null | undefined {
        return x === undefined || x === null;
    }
}
