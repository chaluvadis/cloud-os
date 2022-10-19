export class FileDescriptor {
    constructor(
        public readonly path: string,
        public readonly driveName: string,
        public readonly size: number,
        public readonly lastModified: Date
    ) {}
}
