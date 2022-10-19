export class Directory {
    constructor(
        public readonly path: string,
        public readonly fileNames: string[] = [],
        public readonly subDirectories: string[] = []
    ) {}
}
