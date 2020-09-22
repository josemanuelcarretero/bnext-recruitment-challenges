import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { InvalidURLParameterException } from '../exceptions/invalid-url-parameter.exception';

@Injectable()
export class CustomParseIntPipe implements PipeTransform<string> {
    async transform(value: string, metadata: ArgumentMetadata) {
        if (!/^\d+$/.test(value)) {
            throw new InvalidURLParameterException({
                [metadata.data]: [`${metadata.data} is not a integer`]
            });
        }
        return parseInt(value, 10);
    }
}
