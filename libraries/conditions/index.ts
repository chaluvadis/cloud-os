import { ConditionClient } from './clients/condition-client';

const client = new ConditionClient();

export function isNil(x: unknown): x is null | undefined {
    return client.isNil(x);
}
