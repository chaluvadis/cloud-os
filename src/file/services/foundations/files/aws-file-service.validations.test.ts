import { Readable } from 'stream';
import { anyOfClass, instance, mock, reset, verify, when } from 'ts-mockito';
import { Drive } from '../../../../drive/models/drive';
import { NullDriveException } from '../../../../drive/models/exceptions/null-drive-exception';
import { AWSFileBroker } from '../../../brokers/files/aws-file-broker';
import { IllegalFileException } from '../../../models/file/exceptions/illegal-file-exception';
import { IllegalFilePathException } from '../../../models/file/exceptions/illegal-file-path-exception';
import { NullBodyException } from '../../../models/file/exceptions/null-body-exception';
import { NullFileException } from '../../../models/file/exceptions/null-file-exception';
import { NullFilePathException } from '../../../models/file/exceptions/null-file-path-exception';
import { NullResponseException } from '../../../models/file/exceptions/null-response-exception';
import { File } from '../../../models/file/file';
import { AWSFileService } from './aws-file-service';
import { AWSFileValidationException } from './exceptions/aws-file-validation-exception';

describe('AWS File Service Validations Test Suite', () => {
    const mockedBroker = mock(AWSFileBroker);
    const service = new AWSFileService(instance(mockedBroker));

    beforeEach(() => {
        reset(mockedBroker);
    });

    describe('retriveFileAsync', () => {
        test('Should throw a validation exception when the given drive is null', async () => {
            const inputDrive = null as any;
            const inputFilePath = '/file.txt';
            const nullException = new NullDriveException();
            const expectedException = new AWSFileValidationException(
                nullException
            );
            const expectedFilePath = inputFilePath;

            const action = () =>
                service.retrieveFileAsync(inputDrive, inputFilePath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.getFile(anyOfClass(Drive), expectedFilePath)
            ).never();
        });

        test('Should throw a validation exception when the given file path is null', async () => {
            const inputDrive = new Drive('drive');
            const inputFilePath = null as any;
            const nullException = new NullFilePathException();
            const expectedException = new AWSFileValidationException(
                nullException
            );
            const expectedFilePath = inputFilePath;

            const action = () =>
                service.retrieveFileAsync(inputDrive, inputFilePath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.getFile(anyOfClass(Drive), expectedFilePath)
            ).never();
        });

        test('Should throw a validation exception when the given file path is relative', async () => {
            const inputDrive = new Drive('drive');
            const inputFilePath = './foo.txt';
            const illegalException = new IllegalFilePathException(
                new Map([
                    [
                        'path',
                        [
                            `File paths must be absolute. Provided path was "./foo.txt" and is relative.`,
                        ],
                    ],
                ])
            );
            const expectedException = new AWSFileValidationException(
                illegalException
            );
            const expectedFilePath = inputFilePath;

            const action = () =>
                service.retrieveFileAsync(inputDrive, inputFilePath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.getFile(anyOfClass(Drive), expectedFilePath)
            ).never();
        });

        test('Should throw a validation exception when the s3 response is null', async () => {
            const inputDrive = new Drive('drive');
            const inputFilePath = '/file.txt';
            const nullException = new NullResponseException();
            const expectedException = new AWSFileValidationException(
                nullException
            );
            const expectedFilePath = inputFilePath;
            const expectedResponse = null as any;
            when(
                mockedBroker.getFile(anyOfClass(Drive), inputFilePath)
            ).thenResolve(expectedResponse);

            const action = () =>
                service.retrieveFileAsync(inputDrive, inputFilePath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.getFile(anyOfClass(Drive), expectedFilePath)
            ).once();
        });

        test('Should throw a validation exception when the body of the s3 file is null', async () => {
            const inputDrive = new Drive('drive');
            const inputFilePath = '/file.txt';
            const nullException = new NullBodyException();
            const expectedException = new AWSFileValidationException(
                nullException
            );
            const expectedFilePath = inputFilePath;
            when(
                mockedBroker.getFile(anyOfClass(Drive), inputFilePath)
            ).thenResolve({
                $metadata: {},
            });

            const action = () =>
                service.retrieveFileAsync(inputDrive, inputFilePath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.getFile(anyOfClass(Drive), expectedFilePath)
            ).once();
        });
    });

    describe('writeFile', () => {
        test('Should throw a validation exception when given a null drive', async () => {
            const inputDrive = null as any;
            const inputFile = new File('/foo', new Readable());
            const nullException = new NullDriveException();
            const expectedException = new AWSFileValidationException(
                nullException
            );

            const action = () => service.writeFileAsync(inputDrive, inputFile);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.putFile(anyOfClass(Drive), anyOfClass(File))
            ).never();
        });

        test('Should throw a validation exception when given a null file', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = null as any;
            const nullException = new NullFileException();
            const expectedException = new AWSFileValidationException(
                nullException
            );

            const action = () => service.writeFileAsync(inputDrive, inputFile);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.putFile(anyOfClass(Drive), anyOfClass(File))
            ).never();
        });

        test('Should throw a validation exception when given a relative file path', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = new File('./foo', new Readable());
            const illegalException = new IllegalFileException(
                new Map([
                    [
                        'path',
                        [
                            `File paths must be absolute. Provided path was "./foo" and is relative.`,
                        ],
                    ],
                ])
            );
            const expectedException = new AWSFileValidationException(
                illegalException
            );

            const action = () => service.writeFileAsync(inputDrive, inputFile);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.putFile(anyOfClass(Drive), anyOfClass(File))
            ).never();
        });
    });

    describe('removeFile', () => {
        test('Should throw a validation exception when given a null drive', async () => {
            const inputDrive = null as any;
            const inputFile = new File('/foo', new Readable());
            const nullException = new NullDriveException();
            const expectedException = new AWSFileValidationException(
                nullException
            );

            const action = () => service.removeFileAsync(inputDrive, inputFile);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.deleteFile(anyOfClass(Drive), anyOfClass(File))
            ).never();
        });

        test('Should throw a validation exception when given a null file', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = null as any;
            const nullException = new NullFileException();
            const expectedException = new AWSFileValidationException(
                nullException
            );

            const action = () => service.removeFileAsync(inputDrive, inputFile);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.deleteFile(anyOfClass(Drive), anyOfClass(File))
            ).never();
        });

        test('Should throw a validation exception when given a relative file path', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = new File('./foo', new Readable());
            const illegalException = new IllegalFileException(
                new Map([
                    [
                        'path',
                        [
                            `File paths must be absolute. Provided path was "./foo" and is relative.`,
                        ],
                    ],
                ])
            );
            const expectedException = new AWSFileValidationException(
                illegalException
            );

            const action = () => service.removeFileAsync(inputDrive, inputFile);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.deleteFile(anyOfClass(Drive), anyOfClass(File))
            ).never();
        });
    });
});
