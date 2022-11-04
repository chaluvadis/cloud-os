import { ConditionClient } from './clients/conditions/condition-client';

const client = new ConditionClient();

export function isNil(x: unknown): x is null | undefined {
    return client.isNil(x);
}
