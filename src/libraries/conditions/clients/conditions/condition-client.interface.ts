export interface IConditionClient {
    isNil(x: unknown): x is null | undefined;
}
