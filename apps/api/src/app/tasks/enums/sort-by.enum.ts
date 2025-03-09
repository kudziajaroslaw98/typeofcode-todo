import { registerEnumType } from '@nestjs/graphql';

export enum SortBy {
  CREATED_AT = 'createdAt',
  TITLE = 'title',
  STATE = 'state',
  DONE = 'done',
  TIME_SPENT = 'timeSpent',
}

registerEnumType(SortBy, { name: 'SortBy' });
