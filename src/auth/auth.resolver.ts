import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import { AuthRegisterResponseDto } from './dto/auth-register-response.dto';
import { AuthConfirmResponseDto } from './dto/auth-confirm-response.dto';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';
import { AuthLoginInput } from './dto/auth-login.input';
import { AuthDeleteResponseDto } from './dto/auth-delete-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthRegisterResponseDto)
  async register(
    @Args('user', { type: () => CreateUserInput }) user: CreateUserInput,
  ): Promise<AuthRegisterResponseDto> {
    return await this.authService.registerUser(user);
  }

  @Query(() => AuthConfirmResponseDto)
  async confirm(
    @Args('confirm_token', { type: () => String }) confirm_token: string,
  ): Promise<AuthConfirmResponseDto> {
    return await this.authService.confirmUser(confirm_token);
  }

  @Mutation(() => AuthLoginResponseDto)
  async login(
    @Args('credential', { type: () => AuthLoginInput })
    credential: AuthLoginInput,
  ): Promise<AuthLoginResponseDto> {
    return await this.authService.loginUser(credential);
  }

  @Mutation(() => AuthDeleteResponseDto)
  async delete(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<unknown> {
    return await this.authService.deleteAuth(userId);
  }
}
