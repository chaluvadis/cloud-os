import { BundledConstructor } from '../types/bundled-constructor';
import { Constructor } from '../types/constructor';

export function combinePartials<T extends any[]>(constructors: Constructor[]) {
    class Dummy {}

    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(
                Dummy.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                    Object.create(null)
            );
        });
    });

    return Dummy as BundledConstructor<T>;
}
