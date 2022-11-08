import { Constructor } from '../types/constructor';
import { GenericConstructor } from '../types/generic-constructor';

export function combinePartials<T>(constructors: Constructor[]) {
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

    return Dummy as GenericConstructor<T>;
}
