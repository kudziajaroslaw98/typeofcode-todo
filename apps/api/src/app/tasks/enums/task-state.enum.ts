import { registerEnumType } from '@nestjs/graphql';

export enum TaskState {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE',
  ALL = 'ALL',
}

registerEnumType(TaskState, { name: 'TaskState' });
