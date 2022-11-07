import { anyOfClass, instance, mock, reset, verify, when } from 'ts-mockito';
import { Drive } from '../../../../drive/models/drive';
import { AWSDirectoryBroker } from '../../../brokers/directories/aws-directory-broker';
import { NullDirectoryContentsException } from '../../../models/directory/exceptions/null-directory-contents-exception';
import { NullFilePathException } from '../../../models/file/exceptions/null-file-path-exception';
import { AWSDirectoryService } from './aws-directory-service';
import { AWSDirectoryValidationException } from './exceptions/aws-directory-validation-exception';

describe('AWS Directory Service Validations Test Suite', () => {
    const mockedBroker = mock(AWSDirectoryBroker);
    const service = new AWSDirectoryService(instance(mockedBroker));

    beforeEach(() => {
        reset(mockedBroker);
    });

    describe('retrieveDirectory', () => {
        test('Should throw a validation exception when the contents are null', async () => {
            const nullException = new NullDirectoryContentsException();
            const expectedException = new AWSDirectoryValidationException(
                nullException
            );
            const inputDrive = new Drive('drive');
            const inputDirectoryPath = '/directory';
            const expectedDirectoryPath = inputDirectoryPath;
            when(
                mockedBroker.listObjectsInDirectory(
                    anyOfClass(Drive),
                    inputDirectoryPath
                )
            ).thenResolve({
                $metadata: {},
            });

            const action = () =>
                service.retrieveDirectory(inputDrive, inputDirectoryPath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.listObjectsInDirectory(
                    anyOfClass(Drive),
                    expectedDirectoryPath
                )
            ).once();
        });

        test('Should throw a validation exception when the an aws object does not have a key', async () => {
            const nullException = new NullFilePathException();
            const expectedException = new AWSDirectoryValidationException(
                nullException
            );
            const inputDrive = new Drive('drive');
            const inputDirectoryPath = '/directory';
            const expectedDirectoryPath = inputDirectoryPath;
            when(
                mockedBroker.listObjectsInDirectory(
                    anyOfClass(Drive),
                    inputDirectoryPath
                )
            ).thenResolve({
                $metadata: {},
                Contents: [{}],
            });

            const action = () =>
                service.retrieveDirectory(inputDrive, inputDirectoryPath);
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedBroker.listObjectsInDirectory(
                    anyOfClass(Drive),
                    expectedDirectoryPath
                )
            ).once();
        });
    });
});
