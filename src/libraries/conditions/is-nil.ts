export function isNil<T>(x: T | null | undefined): x is null | undefined {
    return x === undefined || x === null;
}
