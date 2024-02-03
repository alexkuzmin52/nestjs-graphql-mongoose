import { Field, ObjectType } from '@nestjs/graphql';
import { UserRoleEnum, UserStatusEnum } from '../../constants';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '../interfaces/user.interface';

@ObjectType()
@Schema()
export class User {
  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;

  @Field(() => String)
  @Prop()
  password: string;

  @Field(() => String, { nullable: true, defaultValue: UserRoleEnum.USER })
  @Prop({ enum: UserRoleEnum, default: UserRoleEnum.USER })
  role?: string;

  @Field(() => String, { nullable: true, defaultValue: UserStatusEnum.PENDING })
  @Prop({ enum: UserStatusEnum, default: UserStatusEnum.PENDING })
  status?: string;
}

export type UserType = Document & IUser;
export const UserSchema = SchemaFactory.createForClass(User);
