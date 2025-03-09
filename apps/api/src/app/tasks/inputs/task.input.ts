import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class TaskInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  _id?: string;

  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  done: boolean;

  @Field(() => String, { nullable: true, defaultValue: 'TODO' })
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

  @Field({ defaultValue: new Date() })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @Field({ defaultValue: new Date() })
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
