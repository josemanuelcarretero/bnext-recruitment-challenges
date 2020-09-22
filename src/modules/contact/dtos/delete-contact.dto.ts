import { IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteContactDto {
    @MinLength(2) @MaxLength(50) @IsString() readonly phone: string;
}
