import { S3ServiceException } from '@aws-sdk/client-s3';
import { anyOfClass, instance, mock, reset, verify, when } from 'ts-mockito';
import { Drive } from '../../../../drive/models/drive';
import { Exception } from '../../../../libraries/exceptions';
import { AWSFileBroker } from '../../../brokers/files/aws-file-broker';
import { AWSFileService } from './aws-file-service';
import { AWSFileDependencyException } from './exceptions/aws-file-dependency-exception';
import { AwsFileServiceException } from './exceptions/aws-file-service-exception';
import { FailedFileRetrievalException } from './exceptions/failed-file-retrieval-exception';

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
                mockedBroker.getReadableFileContent(
                    anyOfClass(Drive),
                    expectedFilePath
                )
            ).thenReject(sdkException);

            const action = () =>
                service.retrieveFileAsync(inputDrive, inputFilePath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.getReadableFileContent(
                    anyOfClass(Drive),
                    expectedFilePath
                )
            ).once();
        });

        test('Should throw a service exception when an unknown exception is thrown', async () => {
            const inputDrive = new Drive('drive');
            const inputFilePath = '/path';
            const randomException = new Exception();
            const expectedException = new AwsFileServiceException(
                new FailedFileRetrievalException(randomException)
            );
            const expectedFilePath = inputFilePath;
            when(
                mockedBroker.getReadableFileContent(
                    anyOfClass(Drive),
                    expectedFilePath
                )
            ).thenReject(randomException);

            const action = () =>
                service.retrieveFileAsync(inputDrive, inputFilePath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.getReadableFileContent(
                    anyOfClass(Drive),
                    expectedFilePath
                )
            ).once();
        });
    });
});
