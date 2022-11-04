import { Exception } from '../../../../exceptions';
import { Executable } from '../../../models/executable/executable';
import { ServiceRuntimeChainService } from './service-runtime-chain-service';

describe('Service Runtime Chain Service Test Suite', () => {
    const service = new ServiceRuntimeChainService();

    describe('createServiceRuntimeChain', () => {
        test('Should create and run a simple service runtime chain', () => {
            const executable = jest.fn(() => 2);
            const expectedResult = 2;

            const actualResult = service
                .createServiceRuntimeChain(executable)
                .run();

            expect(actualResult).toEqual(expectedResult);
            expect(executable).toBeCalledTimes(1);
        });

        test('Should create and add an exception handler to the runtime chain', () => {
            const executable = jest.fn(() => 2);
            const exceptionHandler = jest.fn(
                (executable: Executable<number>) => {
                    try {
                        return executable();
                    } catch (error) {
                        throw error;
                    }
                }
            );
            const expectedResult = 2;

            const actualResult = service
                .createServiceRuntimeChain(executable)
                .exceptionHandler(exceptionHandler)
                .run();

            expect(actualResult).toEqual(expectedResult);
            expect(executable).toBeCalledTimes(1);
            expect(exceptionHandler).toBeCalledTimes(1);
        });

        test('Should create and add an exception handler to the runtime chain that throws', () => {
            const thrownError = new Error();
            const executable = jest.fn<number, []>(() => {
                throw thrownError;
            });
            const exceptionHandler = jest.fn(
                (executable: Executable<number>) => {
                    try {
                        return executable();
                    } catch (error) {
                        throw Exception.fromError(error);
                    }
                }
            );
            const expectedException = Exception.fromError(thrownError);

            const action = () =>
                service
                    .createServiceRuntimeChain(executable)
                    .exceptionHandler(exceptionHandler)
                    .run();
            expect(action).toThrowException(expectedException);

            expect(executable).toBeCalledTimes(1);
            expect(exceptionHandler).toBeCalledTimes(1);
        });
    });

    describe('createAsyncServiceRuntimeChain', () => {
        test('Should create and run a simple async service runtime chain', async () => {
            const executable = jest.fn(() => Promise.resolve(2));
            const expectedResult = 2;

            const actualResult = await service
                .createAsyncServiceRuntimeChain(executable)
                .run();

            expect(actualResult).toEqual(expectedResult);
            expect(executable).toBeCalledTimes(1);
        });

        test('Should create and add an exception handler to the runtime chain', async () => {
            const executable = jest.fn(() => Promise.resolve(2));
            const exceptionHandler = jest.fn(
                async (executable: Executable<Promise<number>>) => {
                    try {
                        return executable();
                    } catch (error) {
                        throw error;
                    }
                }
            );
            const expectedResult = 2;

            const actualResult = await service
                .createAsyncServiceRuntimeChain(executable)
                .exceptionHandler(exceptionHandler)
                .run();

            expect(actualResult).toEqual(expectedResult);
            expect(executable).toBeCalledTimes(1);
            expect(exceptionHandler).toBeCalledTimes(1);
        });

        test('Should create and add an exception handler to the runtime chain that throws', async () => {
            const thrownError = new Error();
            const executable = jest.fn<Promise<number>, []>(() => {
                throw thrownError;
            });
            const exceptionHandler = jest.fn(
                (executable: Executable<Promise<number>>) => {
                    try {
                        return executable();
                    } catch (error) {
                        throw Exception.fromError(error);
                    }
                }
            );
            const expectedException = Exception.fromError(thrownError);

            const action = async () =>
                service
                    .createServiceRuntimeChain(executable)
                    .exceptionHandler(exceptionHandler)
                    .run();
            expect(action).toThrowExceptionAsync(expectedException);

            expect(executable).toBeCalledTimes(1);
            expect(exceptionHandler).toBeCalledTimes(1);
        });
    });
});
