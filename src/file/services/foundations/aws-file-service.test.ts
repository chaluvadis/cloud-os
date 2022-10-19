import { instance, mock } from 'ts-mockito';
import { AWSFileBroker } from '../../brokers/aws-file-broker';
import { AWSFileService } from './aws-file-service';

describe('AWS File Service Test Suite', () => {
    const mockedBroker = mock(AWSFileBroker);
    const service = new AWSFileService(instance(mockedBroker));

    describe('retrieveFile', () => {});
});
