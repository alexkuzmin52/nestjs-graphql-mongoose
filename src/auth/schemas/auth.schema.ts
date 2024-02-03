import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { IAuth } from '../interfaces/auth.interface';

@ObjectType()
@Schema({ timestamps: true })
export class Auth {
  @Field(() => User)
  @Prop()
  userId: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  access_token: string;

  @Field(() => String)
  @Prop()
  refresh_token: string;
}

export type AuthType = IAuth & Document;
export const AuthSchema = SchemaFactory.createForClass(Auth);
