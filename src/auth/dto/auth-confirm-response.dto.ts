import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthConfirmResponseDto {
  @Field(() => String)
  message: string;
}
