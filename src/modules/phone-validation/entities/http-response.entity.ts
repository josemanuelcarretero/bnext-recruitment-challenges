import { PhoneValidateResponse } from './phone-validate-response.entity';

export interface HttpResponse {
    readonly data: PhoneValidateResponse;
    readonly status: number;
}
