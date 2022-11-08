import { Constructor } from './constructor';

export type ConstructorsToInstances<T extends Constructor[]> = {
    [K in keyof T]: T[K] extends Constructor ? InstanceType<T[K]> : T[K];
};
