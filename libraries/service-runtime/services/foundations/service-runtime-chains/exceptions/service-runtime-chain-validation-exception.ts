import { Exception } from '../../../../../exceptions';

export class ServiceRuntimeChainValidationException extends Exception {
    constructor(innerException: Exception) {
        super(
            'Service runtime chain validation exception, contact support.',
            innerException
        );
    }
}
