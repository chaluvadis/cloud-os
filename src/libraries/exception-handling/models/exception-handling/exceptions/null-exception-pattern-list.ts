import { Exception } from '../../../../exceptions';

export class NullExceptionPatternList extends Exception {
    constructor() {
        super('Exception pattern list is null.');
    }
}
