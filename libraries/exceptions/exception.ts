import { ExceptionData } from './models/exception-data';
import { ExceptionMessageBuilder } from './exception-message-builder';

export class Exception extends Error {
    constructor(
        public readonly message: string = '',
        public readonly innerException: Error | null = null,
        public readonly data: ExceptionData = new Map()
    ) {
        super(message);
        this.name = this.constructor.name;
    }

    static fromError(error: any) {
        if (error instanceof Exception) {
            return error;
        } else if (error instanceof Error) {
            return new Exception(error.message, error);
        } else if (error instanceof Symbol) {
            return new Exception(error.toString());
        } else if (typeof error === 'string') {
            return new Exception(error);
        } else {
            return new Exception(String(error));
        }
    }

    upsertDataList(key: string, value: string) {
        if (this.data.has(key)) {
            (this.data.get(key) as string[]).push(value);
        } else {
            this.data.set(key, [value]);
        }
    }

    throwIfContainsErrors() {
        if (this.data.size > 0) {
            throw this;
        }
    }

    addExceptionData(map: ExceptionData) {
        if (map != null) {
            for (const [key, value] of map.entries()) {
                this.addErrorMessages(key, value);
            }
        }
    }

    addErrorMessages(key: string, value: string[]) {
        if (this.data.has(key)) {
            throw new Error(`Exception data already contains the key: ${key}.`);
        }
        this.data.set(key, value);
    }

    equals(other: Exception) {
        return (
            this.name === other.name &&
            this.message == other.message &&
            this.innerExceptionEquals(other) &&
            this.dataEquals(other.data)
        );
    }

    private innerExceptionEquals(other: Exception) {
        if (other.innerException === null && this.innerException === null) {
            return true;
        }
        if (
            other.innerException instanceof Exception &&
            this.innerException instanceof Exception
        ) {
            return this.innerException.equals(other.innerException);
        } else if (
            other.innerException instanceof Error &&
            this.innerException instanceof Error
        ) {
            return (
                other.innerException.name === this.innerException.name &&
                other.innerException.message === this.innerException.message
            );
        } else {
            return false;
        }
    }

    dataEquals(map: ExceptionData): boolean {
        const [isEqual] = this.dataEqualsWithDetails(map);
        return isEqual;
    }

    dataEqualsWithDetails(map: ExceptionData): [boolean, string] {
        const messageBuilder = new ExceptionMessageBuilder();
        let isEqual = true;
        if (this.data.size == 0 && map.size == 0) {
            return [isEqual, messageBuilder.toString()];
        }
        if (this.data.size != map.size) {
            isEqual = false;
            messageBuilder.append(
                `- Expected map item count to be ${map.size}, but found ${this.data.size}.`
            );
        }
        const [additionalItems, missingItems, sharedItems] =
            this.getDataDifferences(map);
        isEqual = this.evaluateAdditionalKeys(
            isEqual,
            messageBuilder,
            additionalItems
        );
        isEqual = this.evaluteMissingKeys(
            isEqual,
            messageBuilder,
            missingItems
        );
        isEqual = this.evaluateSharedKeys(isEqual, messageBuilder, sharedItems);
        return [isEqual, messageBuilder.toString()];
    }

    private evaluateAdditionalKeys(
        isEqual: boolean,
        messageBuilder: ExceptionMessageBuilder,
        additionalItems: ExceptionData
    ) {
        if (additionalItems.size == 0) {
            return isEqual;
        }
        for (const [key] of additionalItems.entries()) {
            messageBuilder.append(`- Did not expect to find key '${key}'.`);
        }
        return false;
    }

    private evaluteMissingKeys(
        isEqual: boolean,
        messageBuilder: ExceptionMessageBuilder,
        missingItems: ExceptionData
    ) {
        if (missingItems.size == 0) {
            return isEqual;
        }
        for (const [key] of missingItems.entries()) {
            messageBuilder.append(`- Expected to find key '${key}'.`);
        }
        return false;
    }

    private evaluateSharedKeys(
        isEqual: boolean,
        messageBuilder: ExceptionMessageBuilder,
        sharedItems: ExceptionData
    ) {
        if (sharedItems.size == 0) {
            return isEqual;
        }
        for (const [key, value] of sharedItems.entries()) {
            const expectedValues = value.join(', ');
            const actualValues = this.data.get(key)!.join(', ');

            if (expectedValues !== actualValues) {
                messageBuilder.append(
                    `- Expected to find key '${key}' with value(s) ['${expectedValues}'], but found value(s) ['${actualValues}'].`
                );
                return false;
            }
        }
        return true;
    }

    private getDataDifferences(
        map: ExceptionData
    ): [ExceptionData, ExceptionData, ExceptionData] {
        const additionalItems = new Map(this.data);
        const missingItems = new Map(map);
        const sharedItems = new Map(map);

        for (const [key] of map.entries()) {
            additionalItems.delete(key);
        }
        for (const [key] of this.data.entries()) {
            missingItems.delete(key);
        }
        for (const [key] of additionalItems.entries()) {
            sharedItems.delete(key);
        }
        for (const [key] of missingItems.entries()) {
            sharedItems.delete(key);
        }

        return [additionalItems, missingItems, sharedItems];
    }
}
