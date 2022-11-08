import { S3ServiceException } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { anyOfClass, instance, mock, reset, verify, when } from 'ts-mockito';
import { Drive } from '../../../../drive/models/drive';
import { Exception } from '../../../../libraries/exceptions';
import { AWSFileBroker } from '../../../brokers/files/aws-file-broker';
import { File } from '../../../models/file/file';
import { AWSFileService } from './aws-file-service';
import { AWSFileDependencyException } from './exceptions/aws-file-dependency-exception';
import { FailedAWSFileApiException } from './exceptions/failed-aws-file-api-exception';

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
            const failedException = new FailedAWSFileApiException(
                innerException
            );
            const expectedException = new AWSFileDependencyException(
                failedException
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
            const failedException = new FailedAWSFileApiException(
                innerException
            );
            const expectedException = new AWSFileDependencyException(
                failedException
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
            const failedException = new FailedAWSFileApiException(
                innerException
            );
            const expectedException = new AWSFileDependencyException(
                failedException
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
    });
});
