import { Readable } from 'stream';
import {
    anyOfClass,
    capture,
    instance,
    mock,
    reset,
    verify,
    when,
} from 'ts-mockito';
import { Drive } from '../../../drive/models/drive';
import { AWSFileBroker } from '../../brokers/aws-file-broker';
import { NullFileBodyException } from '../../models/file/exceptions/null-file-body-exception';
import { File } from '../../models/file/file';
import { AWSFileService } from './aws-file-service';
import { AwsFileValidationException } from './exceptions/aws-file-validation-exception';

describe('AWS File Service Test Suite', () => {
    const mockedBroker = mock(AWSFileBroker);
    const service = new AWSFileService(instance(mockedBroker));

    beforeEach(() => {
        reset(mockedBroker);
    });

    describe('retrieveFile', () => {
        test('Should retrieve a file', async () => {
            const inputDrive = new Drive('drive');
            const inputFilePath = '/file.txt';
            const contentReadable = new Readable();
            (contentReadable as any).transformToString = () =>
                Promise.resolve('content');
            const expectedFilePath = inputFilePath;
            const expectedFile = new File(expectedFilePath, 'content');
            when(
                mockedBroker.getReadableFileContent(
                    anyOfClass(Drive),
                    expectedFilePath
                )
            ).thenResolve({
                $metadata: {},
                Body: contentReadable as any,
            });

            const actualFile = await service.retrieveFile(
                inputDrive,
                inputFilePath
            );

            expect(actualFile).toEqual(expectedFile);
            verify(
                mockedBroker.getReadableFileContent(
                    anyOfClass(Drive),
                    expectedFilePath
                )
            ).once();
        });

        test('Should throw a validation exception when the body of the s3 file is null', async () => {
            const inputDrive = new Drive('drive');
            const inputFilePath = '/file.txt';
            const nullException = new NullFileBodyException();
            const expectedException = new AwsFileValidationException(
                nullException
            );
            const expectedFilePath = inputFilePath;
            when(
                mockedBroker.getReadableFileContent(
                    anyOfClass(Drive),
                    inputFilePath
                )
            ).thenResolve({
                $metadata: {},
            });

            const action = () =>
                service.retrieveFile(inputDrive, inputFilePath);
            await expect(action).rejects.toThrow(expectedException);

            verify(
                mockedBroker.getReadableFileContent(
                    anyOfClass(Drive),
                    expectedFilePath
                )
            ).once();
        });
    });

    describe('writeFile', () => {
        test('Should write file to aws', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = new File('/file.txt', 'content');
            const expectedFile = inputFile;
            when(
                mockedBroker.putFile(anyOfClass(Drive), anyOfClass(File))
            ).thenResolve({
                $metadata: {},
            });

            const actualFile = await service.writeFile(inputDrive, inputFile);

            expect(actualFile).toEqual(expectedFile);
            verify(
                mockedBroker.putFile(anyOfClass(Drive), anyOfClass(File))
            ).once();
            const [drive, file] = capture(mockedBroker.putFile).last();
            expect(drive).toEqual(inputDrive);
            expect(file).toEqual(inputFile);
        });
    });
});
