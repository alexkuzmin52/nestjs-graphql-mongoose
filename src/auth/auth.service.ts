import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthType } from './schemas/auth.schema';
import { CreateUserInput } from '../user/dto/create-user.input';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRegisterResponseDto } from './dto/auth-register-response.dto';
import { AuthConfirmResponseDto } from './dto/auth-confirm-response.dto';
import { UserStatusEnum } from '../constants';
import { AuthLoginInput } from './dto/auth-login.input';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';
import { IUser } from '../user/interfaces/user.interface';
import { AuthDeleteResponseDto } from './dto/auth-delete-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthType>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(
    createUserInput: CreateUserInput,
  ): Promise<AuthRegisterResponseDto> {
    const { password } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);

    const registeredUser = await this.userService.createUser({
      ...createUserInput,
      password: hashedPassword,
    });
    console.log(registeredUser);
    const confirmToken = this.jwtService.sign(
      {
        _id: registeredUser._id,
        email: registeredUser.email,
        role: registeredUser.role,
      },
      {
        secret: this.configService.get('JWT_CONFIRM_EMAIL_SECRET'),
        expiresIn: this.configService.get('JWT_CONFIRM_EMAIL_LIFETIME'),
      },
    );

    // return registeredUser;
    return { message: 'Confirm your register', token: confirmToken };
  }

  async confirmUser(confirm_token: string): Promise<AuthConfirmResponseDto> {
    const payload = this.jwtService.verify(confirm_token, {
      secret: this.configService.get('JWT_CONFIRM_EMAIL_SECRET'),
    });
    const confirmedUser = this.userService.updateUser(payload['_id'], {
      status: UserStatusEnum.CONFIRMED,
    });
    console.log(confirmedUser);
    return { message: 'Registration successfully confirmed. Please login' };
  }

  async loginUser(credential: AuthLoginInput): Promise<AuthLoginResponseDto> {
    const { email, password } = credential;
    const user = await this.userService.findUser(email);
    if (
      !user ||
      (user.status !== UserStatusEnum.CONFIRMED &&
        user.status !== UserStatusEnum.LOGGED_OUT)
    ) {
      throw new ForbiddenException(
        `User status ${user.status} must be as /confirmed/ or /logout/`,
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) throw new UnauthorizedException('Bad credential');

    const updatedUser = await this.userService.updateUser(user._id, {
      status: UserStatusEnum.LOGGED_IN,
    });
    const tokensPair = await this.createTokensPair(updatedUser);

    const newAuthModel = new this.authModel({
      userId: user._id,
      access_token: tokensPair.access_token,
      refresh_token: tokensPair.refresh_token,
    });
    await newAuthModel.save();
    return tokensPair;
  }

  private async createTokensPair(user: IUser): Promise<AuthLoginResponseDto> {
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_SECRET_LIFETIME'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_SECRET_LIFETIME'),
    });

    return { access_token, refresh_token };
  }

  async deleteAuth(userId: string): Promise<AuthDeleteResponseDto> {
    const result = await this.authModel.deleteOne({ userId }).exec();
    console.log(result);
    return { message: `Auth for user ${userId} deleted` };
  }
}
