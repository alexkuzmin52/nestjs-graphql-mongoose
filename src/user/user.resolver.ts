import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { IUser } from './interfaces/user.interface';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [IUser], { name: 'users' })
  async getUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Query(() => User, {
    name: 'userById',
    description: 'Getting user by his Id',
  })
  async getUser(@Args('id', { type: () => String }) id: string): Promise<User> {
    console.log(id);
    return await this.userService.getUserById(id);
  }
}
