import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactDto {
    @MinLength(2) @MaxLength(100) @IsString() readonly contactName: string;
    @MinLength(2) @MaxLength(50) @IsString() readonly phone: string;
}
