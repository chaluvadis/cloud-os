import { _Object } from '@aws-sdk/client-s3';
import { anyOfClass, instance, mock, reset, verify, when } from 'ts-mockito';
import { Drive } from '../../../../drive/models/drive';
import { AWSDirectoryBroker } from '../../../brokers/directories/aws-directory-broker';
import { Directory } from '../../../models/directory/directory';
import { AWSDirectoryService } from './aws-directory-service';

describe('AWS Directory Service Test Suite', () => {
    const mockedBroker = mock(AWSDirectoryBroker);
    const service = new AWSDirectoryService(instance(mockedBroker));

    beforeEach(() => {
        reset(mockedBroker);
    });

    describe('retrieveDirectory', () => {
        test('Should list all files within a directory when it only has files', async () => {
            const inputDrive = new Drive('drive');
            const inputDirectoryPath = '/directory';
            const expectedFileNames = ['fileA.txt', 'fileB.txt'];
            const returnedObjects: _Object[] = [
                {
                    Key: '/directory/fileA.txt',
                },
                {
                    Key: '/directory/fileB.txt',
                },
            ];
            const expectedDirectory = new Directory(
                '/directory',
                expectedFileNames
            );
            const expectedDirectoryPath = inputDirectoryPath;
            when(
                mockedBroker.listObjectsInDirectory(
                    anyOfClass(Drive),
                    inputDirectoryPath
                )
            ).thenResolve({
                $metadata: {},
                Contents: returnedObjects,
            });

            const actualDirectory = await service.retrieveDirectory(
                inputDrive,
                inputDirectoryPath
            );

            expect(actualDirectory).toEqual(expectedDirectory);
            verify(
                mockedBroker.listObjectsInDirectory(
                    anyOfClass(Drive),
                    expectedDirectoryPath
                )
            ).once();
        });

        test('Should list all files within a directory when it has subdirectories and files', async () => {
            const inputDrive = new Drive('drive');
            const inputDirectoryPath = '/directory';
            const expectedFileNames = ['fileA.txt'];
            const expectedSubdirectories = ['subdirectoryA', 'subdirectoryB'];
            const returnedObjects: _Object[] = [
                {
                    Key: '/directory/fileA.txt',
                },
                {
                    Key: '/directory/subdirectoryA/fileB.txt',
                },
                {
                    Key: '/directory/subdirectoryB/subdirectoryC/fileC.txt',
                },
                {
                    Key: '/directory/subdirectoryB/subdirectoryC/fileC.txt',
                },
            ];
            const expectedDirectory = new Directory(
                '/directory',
                expectedFileNames,
                expectedSubdirectories
            );
            const expectedDirectoryPath = inputDirectoryPath;
            when(
                mockedBroker.listObjectsInDirectory(
                    anyOfClass(Drive),
                    inputDirectoryPath
                )
            ).thenResolve({
                $metadata: {},
                Contents: returnedObjects,
            });

            const actualDirectory = await service.retrieveDirectory(
                inputDrive,
                inputDirectoryPath
            );

            expect(actualDirectory).toEqual(expectedDirectory);
            verify(
                mockedBroker.listObjectsInDirectory(
                    anyOfClass(Drive),
                    expectedDirectoryPath
                )
            ).once();
        });
    });

    describe('makeDirectory', () => {
        test('Should create a new directory', async () => {
            const inputDrive = new Drive('drive');
            const inputDirectoryPath = '/directory';
            const expectedDirectory = new Directory('/directory');
            const expectedDirectoryPath = inputDirectoryPath;
            when(
                mockedBroker.putDirectory(anyOfClass(Drive), inputDirectoryPath)
            ).thenResolve({
                $metadata: {},
            });

            const actualDirectory = await service.makeDirectory(
                inputDrive,
                inputDirectoryPath
            );

            expect(actualDirectory).toEqual(expectedDirectory);
            verify(
                mockedBroker.putDirectory(
                    anyOfClass(Drive),
                    expectedDirectoryPath
                )
            ).once();
        });
    });
});
