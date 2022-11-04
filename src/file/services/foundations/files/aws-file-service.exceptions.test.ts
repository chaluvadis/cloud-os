import { anyOfClass, instance, mock, reset, verify, when } from 'ts-mockito';
import { Drive } from '../../../../drive/models/drive';
import { AWSFileBroker } from '../../../brokers/files/aws-file-broker';
import { NullFileBodyException } from '../../../models/file/exceptions/null-file-body-exception';
import { AWSFileService } from './aws-file-service';
import { AWSFileValidationException } from './exceptions/aws-file-validation-exception';

describe('AWS File Service Exceptions Test Suite', () => {
    const mockedBroker = mock(AWSFileBroker);
    const service = new AWSFileService(instance(mockedBroker));

    beforeEach(() => {
        reset(mockedBroker);
    });

    describe('retriveFileAsync', () => {
        test('Should throw a validation exception when the body of the s3 file is null', async () => {
            const inputDrive = new Drive('drive');
            const inputFilePath = '/file.txt';
            const nullException = new NullFileBodyException();
            const expectedException = new AWSFileValidationException(
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
