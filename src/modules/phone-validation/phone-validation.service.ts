import { HttpService, Inject, Injectable } from '@nestjs/common';
import { AppConfig } from '../config/entities/app-config.entity';
import { InvalidPhoneException } from './exceptions/invalid-phone.exception';
import { ExternalPhoneValidationException } from './exceptions/external-phone-validation.exception';
import * as qs from 'querystring';
import { HttpResponse } from './entities/http-response.entity';

@Injectable()
export class PhoneValidationService {
    constructor(
        @Inject(HttpService) private httpService: HttpService,
        @Inject('ConfigApp') private appConfig: AppConfig
    ) {}

    private static generateURL(userId: string, apiKey: string): string {
        return `https://neutrinoapi.net/phone-validate?user-id=${userId}&api-key=${apiKey}`;
    }
    private async buildVerifyPhoneRequest(value: string): Promise<HttpResponse> {
        const url = PhoneValidationService.generateURL(
            this.appConfig.verificationPhone.userId,
            this.appConfig.verificationPhone.apiKey
        );
        const body = { outputCase: 'camel', number: value, countryCode: '+34' };
        const headers = {
            'User-Agent': 'APIMATIC 2.0',
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        let response: any;
        try {
            response = await this.httpService
                .post(url, qs.stringify(body), { headers: headers })
                .toPromise();
        } catch (e) {
            response = e.response;
        }
        return response;
    }

    async verifyPhone(value: string): Promise<string> {
        if (
            this.appConfig.verificationPhone.type === null ||
            this.appConfig.verificationPhone.type === undefined
        ) {
            return value;
        }

        const response: HttpResponse = await this.buildVerifyPhoneRequest(value);

        if (response.status == 200) {
            if (response.data.valid) {
                return response.data.internationalNumber;
            } else {
                throw new InvalidPhoneException();
            }
        } else {
            throw new ExternalPhoneValidationException();
        }
    }
}
