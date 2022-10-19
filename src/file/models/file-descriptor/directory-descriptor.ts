import { FileDescriptor } from './file-descriptor';

export class DirectoryDescriptor {
    constructor(
        public readonly path: string,
        public readonly driveName: string,
        public readonly files: FileDescriptor[],
        public readonly directories: DirectoryDescriptor[]
    ) {}
}
