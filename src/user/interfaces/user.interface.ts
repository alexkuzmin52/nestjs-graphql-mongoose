import { Field, ObjectType } from '@nestjs/graphql';
import { UserRoleEnum, UserStatusEnum } from '../../constants';

@ObjectType()
export class IUser {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true, defaultValue: UserRoleEnum.USER })
  role?: string;

  @Field(() => String, { nullable: true, defaultValue: UserStatusEnum.PENDING })
  status?: string;
}
