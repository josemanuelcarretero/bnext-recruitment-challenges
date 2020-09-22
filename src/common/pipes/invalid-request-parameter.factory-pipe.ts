import { ValidationError } from '@nestjs/common';
import { InvalidRequestParameterException } from '../exceptions/invalid-request-parameter.exception';

export const invalidRequestParameterFactoryPipe = (errors: ValidationError[]) => {
    const errorByField = {};
    errors.forEach((validationError: ValidationError) => {
        errorByField[validationError.property] = Object.values(validationError.constraints);
    });
    return new InvalidRequestParameterException(errorByField);
};
