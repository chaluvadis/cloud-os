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
import { Drive } from '../../../../drive/models/drive';
import { AWSFileBroker } from '../../../brokers/files/aws-file-broker';
import { File } from '../../../models/file/file';
import { AWSFileService } from './aws-file-service';

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

    describe('removeFile', () => {
        test('Should remove file from aws', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = new File('./file.txt', 'content');
            const expectedFile = new File('./file.txt', 'content');
            when(
                mockedBroker.deleteFile(anyOfClass(Drive), anyOfClass(File))
            ).thenResolve({
                $metadata: {},
            });

            const actualFile = await service.removeFile(inputDrive, inputFile);

            expect(actualFile).toEqual(expectedFile);
            verify(
                mockedBroker.deleteFile(anyOfClass(Drive), anyOfClass(File))
            ).once();
        });
    });
});
