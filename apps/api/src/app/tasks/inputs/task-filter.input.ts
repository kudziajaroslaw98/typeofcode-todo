import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortBy } from '../enums/sort-by.enum';
import { SortDirection } from '../enums/sort-direction.enum';
import { TaskState } from '../enums/task-state.enum';

@InputType()
export class TaskFilterInput {
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  showDoneTasks?: boolean;

  @Field(() => SortBy, { nullable: true, defaultValue: SortBy.CREATED_AT })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @Field(() => SortDirection, {
    nullable: true,
    defaultValue: SortDirection.DESC,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;

  @Field(() => TaskState, { nullable: true, defaultValue: TaskState.ALL })
  @IsOptional()
  @IsEnum(TaskState)
  filterByState?: TaskState;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  filterByTitle?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  filterByDateFrom?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  filterByDateTo?: Date;
}
