import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class TaskUpdateInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  done?: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  state?: 'TODO' | 'DOING' | 'DONE';

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  startedAt?: Date;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  timeSpent?: number;
}
