import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthRegisterResponseDto {
  @Field(() => String)
  message: string;

  @Field(() => String)
  token: string;
}
