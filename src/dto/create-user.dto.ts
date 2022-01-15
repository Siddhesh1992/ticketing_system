import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @Type(() => Number)
  readonly type: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly pass: string;
}
