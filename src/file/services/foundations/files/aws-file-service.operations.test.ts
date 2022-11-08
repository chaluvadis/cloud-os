import { S3ServiceException } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { anyOfClass, instance, mock, reset, verify, when } from 'ts-mockito';
import { Drive } from '../../../../drive/models/drive';
import { Exception } from '../../../../libraries/exceptions';
import { AWSFileBroker } from '../../../brokers/files/aws-file-broker';
import { File } from '../../../models/file/file';
import { AWSFileService } from './aws-file-service';
import { AWSFileDependencyException } from './exceptions/aws-file-dependency-exception';
import { AWSFileServiceException } from './exceptions/aws-file-service-exception';
import { FailedFileRemovalException } from './exceptions/failed-file-removal-exception';
import { FailedFileRetrievalException } from './exceptions/failed-file-retrieval-exception';
import { FailedFileWriteException } from './exceptions/failed-file-write-exception';

describe('AWS File Service Operations Test Suite', () => {
    const mockedBroker = mock(AWSFileBroker);
    const service = new AWSFileService(instance(mockedBroker));

    beforeEach(() => {
        reset(mockedBroker);
    });

    describe('retrieveFileAsync', () => {
        test('Should throw a dependency exception when an S3 service exception is thrown', async () => {
            const inputDrive = new Drive('drive');
            const inputFilePath = '/path';
            const sdkException = new S3ServiceException({
                $fault: 'client',
                $metadata: {},
                name: S3ServiceException.name,
            });
            const innerException = Exception.fromError(sdkException);
            const expectedException = new AWSFileDependencyException(
                innerException
            );
            const expectedFilePath = inputFilePath;
            when(
                mockedBroker.getFile(anyOfClass(Drive), expectedFilePath)
            ).thenReject(sdkException);

            const action = () =>
                service.retrieveFileAsync(inputDrive, inputFilePath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.getFile(anyOfClass(Drive), expectedFilePath)
            ).once();
        });

        test('Should throw a service exception when an unknown exception is thrown', async () => {
            const inputDrive = new Drive('drive');
            const inputFilePath = '/path';
            const randomException = new Exception();
            const expectedException = new AWSFileServiceException(
                new FailedFileRetrievalException(randomException)
            );
            const expectedFilePath = inputFilePath;
            when(
                mockedBroker.getFile(anyOfClass(Drive), expectedFilePath)
            ).thenReject(randomException);

            const action = () =>
                service.retrieveFileAsync(inputDrive, inputFilePath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.getFile(anyOfClass(Drive), expectedFilePath)
            ).once();
        });
    });

    describe('writeFileAsync', () => {
        test('Should throw a dependency exception when an S3 service exception is thrown', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = new File('/foo', new Readable());
            const sdkException = new S3ServiceException({
                $fault: 'client',
                $metadata: {},
                name: S3ServiceException.name,
            });
            const innerException = Exception.fromError(sdkException);
            const expectedException = new AWSFileDependencyException(
                innerException
            );
            when(
                mockedBroker.putFile(anyOfClass(Drive), anyOfClass(File))
            ).thenReject(sdkException);

            const action = () => service.writeFileAsync(inputDrive, inputFile);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.putFile(anyOfClass(Drive), anyOfClass(File))
            ).once();
        });

        test('Should throw a service exception when an unknown exception is thrown', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = new File('/foo', new Readable());
            const randomException = new Exception();
            const expectedException = new AWSFileServiceException(
                new FailedFileWriteException(randomException)
            );
            when(
                mockedBroker.putFile(anyOfClass(Drive), anyOfClass(File))
            ).thenReject(randomException);

            const action = () => service.writeFileAsync(inputDrive, inputFile);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.putFile(anyOfClass(Drive), anyOfClass(File))
            ).once();
        });
    });

    describe('removeFileAsync', () => {
        test('Should throw a dependency exception when an S3 service exception is thrown', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = new File('/foo', new Readable());
            const sdkException = new S3ServiceException({
                $fault: 'client',
                $metadata: {},
                name: S3ServiceException.name,
            });
            const innerException = Exception.fromError(sdkException);
            const expectedException = new AWSFileDependencyException(
                innerException
            );
            when(
                mockedBroker.deleteFile(anyOfClass(Drive), anyOfClass(File))
            ).thenReject(sdkException);

            const action = () => service.removeFileAsync(inputDrive, inputFile);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.deleteFile(anyOfClass(Drive), anyOfClass(File))
            ).once();
        });

        test('Should throw a service exception when an unknown exception is thrown', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = new File('/foo', new Readable());
            const randomException = new Exception();
            const expectedException = new AWSFileServiceException(
                new FailedFileRemovalException(randomException)
            );
            when(
                mockedBroker.deleteFile(anyOfClass(Drive), anyOfClass(File))
            ).thenReject(randomException);

            const action = () => service.removeFileAsync(inputDrive, inputFile);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.deleteFile(anyOfClass(Drive), anyOfClass(File))
            ).once();
        });
    });
});
