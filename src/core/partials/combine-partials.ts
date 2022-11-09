import { BundledConstructor } from '../types/bundled-constructor';
import { Constructor } from '../types/constructor';

export function combinePartials<T extends any[]>(
    derivedConstructor: Constructor,
    constructors: Constructor[]
) {
    constructors.forEach((classRef) => {
        Object.getOwnPropertyNames(classRef.prototype).forEach((name) => {
            // you can get rid of type casting in this way
            const descriptor = Object.getOwnPropertyDescriptor(
                classRef.prototype,
                name
            );
            if (name !== 'constructor' && descriptor) {
                Object.defineProperty(
                    derivedConstructor.prototype,
                    name,
                    descriptor
                );
            }
        });
    });

    return derivedConstructor as BundledConstructor<T>;
}
