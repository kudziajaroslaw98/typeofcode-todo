import { Field, Int, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class DeleteResponseDto {
  @Field()
  acknowledged: boolean;

  @Field(() => Int)
  deletedCount: number;
}
