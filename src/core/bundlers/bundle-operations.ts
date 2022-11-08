import { combinePartials } from '../partials/combine-partials';
import { BundledConstructor } from '../types/bundled-constructor';
import { Constructor } from '../types/constructor';

export function BundleOperations<T extends any[]>(...partials: Constructor[]) {
    return combinePartials(partials) as BundledConstructor<T>;
}
