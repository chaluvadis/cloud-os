export interface IConditionService {
    isNil(x: unknown): x is null | undefined;
}
