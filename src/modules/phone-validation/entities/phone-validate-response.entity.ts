export interface PhoneValidateResponse {
    readonly valid: boolean;
    readonly internationalCallingCode: string;
    readonly countryCode: string;
    readonly location: string;
    readonly isMobile: boolean;
    readonly type: string;
    readonly internationalNumber: string;
    readonly localNumber: string;
    readonly country: string;
    readonly countryCode3: string;
    readonly currencyCode: string;
    readonly apiError: number;
    readonly apiErrorMsg: string;
}
