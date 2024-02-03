import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthDeleteResponseDto {
  @Field(() => String)
  message: string;
}
