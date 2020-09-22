import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @MinLength(2) @MaxLength(100) @IsString() readonly firstName: string;
    @MinLength(2) @MaxLength(100) @IsString() readonly lastName: string;
    @MinLength(2) @MaxLength(50) @IsString() readonly phone: string;
}
