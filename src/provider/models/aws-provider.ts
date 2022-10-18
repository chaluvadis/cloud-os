export class AWSProvider {
    constructor(
        private readonly accessIdKey: string,
        private readonly secretAccessKey: string,
        private readonly region: string
    ) {}
}
