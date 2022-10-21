import { ConditionClient } from './clients/condition-client';

const client = new ConditionClient();

export function isNil(x: unknown) {
    client.isNil(x);
}
