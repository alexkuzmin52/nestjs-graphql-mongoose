import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IAuth {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  access_token: string;

  @Field(() => String)
  refresh_token: string;
}
