import { Executable } from '../executable/executable';

export type ExceptionHandlerExecutor<T> = (executable: Executable<T>) => T;
