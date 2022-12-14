import { ExceptionData } from './exception-data';
import { ExceptionMessageBuilder } from '../message-builders/exception-message-builder';
import { isNil } from '../../../conditions';

export class Exception extends Error {
    constructor(
        public readonly message: string = '',
        public readonly innerException: Exception | null = null,
        public readonly data: ExceptionData = new Map()
    ) {
        super(message);
        this.name = this.constructor.name;
    }

    static fromError(error: unknown) {
        if (error instanceof Exception) {
            return error;
        } else if (error instanceof Error) {
            const exception = new Exception(error.message);
            exception.name = error.name;
            exception.stack = error.stack;
            return exception;
        } else if (typeof error === 'symbol') {
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

    equals(other: Exception): boolean {
        const [isEqual] = this.equalsWithDetails(other);
        return isEqual;
    }

    equalsWithDetails(other: Exception): [boolean, string] {
        const messageBuilder = new ExceptionMessageBuilder();
        if (this.name !== other.name) {
            messageBuilder.append(
                `Expected exception name to be "${other.name}", was "${this.name}".`
            );
        }
        if (this.message !== other.message) {
            messageBuilder.append(
                `Expected exception message to be "${other.message}", was "${this.message}".`
            );
        }
        const [, details] = this.dataEqualsWithDetails(other.data);
        messageBuilder.append(details);
        const [innerExceptionEqual, innerDetails] =
            this.innerExceptionEqualsWithDetails(other);
        messageBuilder.append(innerDetails);
        return [
            this.name === other.name &&
                this.message === other.message &&
                innerExceptionEqual &&
                this.dataEquals(other.data),
            messageBuilder.toString().trim(),
        ];
    }

    private innerExceptionEqualsWithDetails(
        other: Exception
    ): [boolean, string] {
        const messageBuilder = new ExceptionMessageBuilder();
        if (isNil(this.innerException) && isNil(other.innerException)) {
            return [true, messageBuilder.toString()];
        }
        if (!isNil(this.innerException) && isNil(other.innerException)) {
            messageBuilder.append(
                `Did not expect an inner exception of type [${this.innerException.name}].`
            );
            return [false, messageBuilder.toString()];
        }
        if (isNil(this.innerException) && !isNil(other.innerException)) {
            messageBuilder.append(
                `Expected an inner exception of type [${other.innerException.name}].`
            );
            return [false, messageBuilder.toString()];
        }
        const thisInnerException = this.innerException as Exception;
        const otherInnerException = other.innerException as Exception;
        const [innerEquality, innerDetails] =
            thisInnerException.equalsWithDetails(otherInnerException);
        if (!innerEquality) {
            messageBuilder.append(`[${thisInnerException.name}]:`);
            messageBuilder.append(`\t${innerDetails.replace(/\\n/g, '\n\t')}`);
        }
        return [innerEquality, messageBuilder.toString()];
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
        isEqual = this.evaluateMissingKeys(
            isEqual,
            messageBuilder,
            missingItems
        );
        isEqual = this.evaluateSharedKeys(isEqual, messageBuilder, sharedItems);
        return [isEqual, messageBuilder.toString().trim()];
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

    private evaluateMissingKeys(
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
            const expectedValues = value.join("', '");
            const actualValues = this.data.get(key)!.join("', '");
            if (expectedValues !== actualValues) {
                messageBuilder.append(
                    `- Expected to find key '${key}' with value(s) ['${expectedValues}'], but found value(s) ['${actualValues}'].`
                );
                return false;
            }
        }
        return isEqual;
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
