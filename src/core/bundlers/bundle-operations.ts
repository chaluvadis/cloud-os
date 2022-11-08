import { combinePartials } from '../partials/combine-partials';
import { Constructor } from '../types/constructor';
import { ConstructorsToInstances } from '../types/constructors-to-instances';

export function BundleOperations<T extends Constructor[]>(...partials: T) {
    return combinePartials<ConstructorsToInstances<T>>(partials);
}
