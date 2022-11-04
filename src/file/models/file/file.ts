import { Readable } from 'stream';

export class File {
    constructor(
        public readonly path: string,
        public readonly content: Readable
    ) {}
}
