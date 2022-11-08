import { S3ServiceException } from '@aws-sdk/client-s3';
import { anyOfClass, instance, mock, reset, verify, when } from 'ts-mockito';
import { Drive } from '../../../../drive/models/drive';
import { Exception } from '../../../../libraries/exceptions';
import { AWSDirectoryBroker } from '../../../brokers/directories/aws-directory-broker';
import { AWSDirectoryService } from './aws-directory-service';
import { AWSDirectoryDependencyException } from './exceptions/aws-directory-directory-exception';
import { FailedAWSDirectoryApiException } from './exceptions/failed-aws-directory-api-exception';

describe('AWS Directory Service Validations Test Suite', () => {
    const mockedBroker = mock(AWSDirectoryBroker);
    const service = new AWSDirectoryService(instance(mockedBroker));

    beforeEach(() => {
        reset(mockedBroker);
    });

    describe('retrieveDirectory', () => {
        test('Should throw a dependency exception when AWS throws a service exception', async () => {
            const inputDrive = new Drive('drive');
            const inputDirectoryPath = '/path';
            const sdkException = new S3ServiceException({
                $fault: 'client',
                $metadata: {},
                name: '',
            });
            const innerException = Exception.fromError(sdkException);
            const failedException = new FailedAWSDirectoryApiException(
                innerException
            );
            const expectedException = new AWSDirectoryDependencyException(
                failedException
            );
            const expectedFilePath = inputDirectoryPath;
            when(
                mockedBroker.listObjectsInDirectory(
                    anyOfClass(Drive),
                    expectedFilePath
                )
            ).thenReject(sdkException);

            const action = () =>
                service.retrieveDirectory(inputDrive, inputDirectoryPath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.listObjectsInDirectory(
                    anyOfClass(Drive),
                    expectedFilePath
                )
            ).once();
        });
    });

    describe('makeDirectory', () => {
        test('Should throw a dependency exception when AWS throws a service exception', async () => {
            const inputDrive = new Drive('drive');
            const inputDirectoryPath = '/path';
            const sdkException = new S3ServiceException({
                $fault: 'client',
                $metadata: {},
                name: '',
            });
            const innerException = Exception.fromError(sdkException);
            const failedException = new FailedAWSDirectoryApiException(
                innerException
            );
            const expectedException = new AWSDirectoryDependencyException(
                failedException
            );
            const expectedFilePath = inputDirectoryPath;
            when(
                mockedBroker.putDirectory(anyOfClass(Drive), expectedFilePath)
            ).thenReject(sdkException);

            const action = () =>
                service.makeDirectory(inputDrive, inputDirectoryPath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.putDirectory(anyOfClass(Drive), expectedFilePath)
            ).once();
        });
    });
});
