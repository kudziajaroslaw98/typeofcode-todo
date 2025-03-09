import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import type { Task } from '../schemas/task.schema';
@ObjectType()
export class TaskDto {
  constructor(task: Task) {
    Object.assign(this, task);
  }

  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  done: boolean;

  @Field()
  state: 'TODO' | 'DOING' | 'DONE';

  @Field({ nullable: true })
  startedAt?: Date;

  @Field(() => Int, { defaultValue: 0 })
  timeSpent: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
