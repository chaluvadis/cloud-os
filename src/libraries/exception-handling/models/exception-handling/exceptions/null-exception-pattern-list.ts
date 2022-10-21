import { Exception } from '../../../../exceptions/exception';

export class NullExceptionPatternList extends Exception {
    constructor() {
        super('Exception pattern list is null.');
    }
}
