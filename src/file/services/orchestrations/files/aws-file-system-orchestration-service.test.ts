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
import { Directory } from '../../../models/directory/directory';
import { File } from '../../../models/file/file';
import { AWSDirectoryService } from '../../foundations/directories/aws-directory-service';
import { AWSFileService } from '../../foundations/files/aws-file-service';
import { AWSFileSystemOrchestrationService } from './aws-file-system-orchestration-service';

describe('AWS File System Orchestration Service Test Suite', () => {
    const mockedFileService = mock(AWSFileService);
    const mockedDirectoryService = mock(AWSDirectoryService);
    const service = new AWSFileSystemOrchestrationService(
        instance(mockedFileService),
        instance(mockedDirectoryService)
    );

    beforeEach(() => {
        reset(mockedFileService);
        reset(mockedDirectoryService);
    });

    describe('readFile', () => {
        test('Should read a file from the file system', async () => {
            const inputDrive = new Drive('drive');
            const inputFilePath = '/file.txt';
            const storedFile = new File(inputFilePath, new Readable());
            const expectedFile = storedFile;
            when(
                mockedFileService.retrieveFileAsync(inputDrive, inputFilePath)
            ).thenResolve(storedFile);

            const actualFile = await service.readFile(
                inputDrive,
                inputFilePath
            );

            expect(actualFile).toEqual(expectedFile);
            verify(
                mockedFileService.retrieveFileAsync(inputDrive, inputFilePath)
            ).once();
        });
    });

    describe('removeFile', () => {
        test('Should remove a file from the file system', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = new File('/file.txt', new Readable());
            const storedFile = inputFile;
            const expectedFile = storedFile;
            when(
                mockedFileService.removeFileAsync(inputDrive, inputFile)
            ).thenResolve(storedFile);

            const actualFile = await service.removeFile(inputDrive, inputFile);

            expect(actualFile).toEqual(expectedFile);
            verify(
                mockedFileService.removeFileAsync(inputDrive, inputFile)
            ).once();
        });
    });

    describe('writeFile', () => {
        test('Should write a file to the file system', async () => {
            const inputDrive = new Drive('drive');
            const inputFile = new File('/file.txt', new Readable());
            const storedFile = inputFile;
            const expectedFile = storedFile;
            when(
                mockedFileService.writeFileAsync(inputDrive, inputFile)
            ).thenResolve(storedFile);

            const actualFile = await service.writeFile(inputDrive, inputFile);

            expect(actualFile).toEqual(expectedFile);
            verify(
                mockedFileService.writeFileAsync(inputDrive, inputFile)
            ).once();
        });
    });

    describe('listFiles', () => {
        test('Should list the files in the directory', async () => {
            const inputDrive = new Drive('drive');
            const directoryPath = '/directory';
            const storedDirectory = new Directory(
                directoryPath,
                ['file.txt'],
                ['dir']
            );
            const expectedDirectory = storedDirectory;
            when(
                mockedDirectoryService.retrieveDirectory(
                    inputDrive,
                    directoryPath
                )
            ).thenResolve(storedDirectory);

            const actualDirectory = await service.listFiles(
                inputDrive,
                directoryPath
            );

            expect(actualDirectory).toEqual(expectedDirectory);
            verify(
                mockedDirectoryService.retrieveDirectory(
                    inputDrive,
                    directoryPath
                )
            ).once();
        });
    });

    describe('makeDirectory', () => {
        test('Should create a directory', async () => {
            const inputDrive = new Drive('drive');
            const inputDirectory = new Directory('/directory');
            const storedDirectory = inputDirectory;
            const expectedDirectory = inputDirectory;
            when(
                mockedDirectoryService.makeDirectory(
                    inputDrive,
                    inputDirectory.path
                )
            ).thenResolve(storedDirectory);

            const actualDirectory = await service.makeDirectory(
                inputDrive,
                inputDirectory
            );

            expect(actualDirectory).toEqual(expectedDirectory);
            verify(
                mockedDirectoryService.makeDirectory(
                    inputDrive,
                    expectedDirectory.path
                )
            ).once();
        });
    });
});
