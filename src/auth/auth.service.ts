import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.users.create(dto);
    return this.buildPublicUser(user);
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = await this.signToken(
      user.id,
      user.email,
      `${user.firstName} ${user.lastName}`,
    );
    return { token, user: this.buildPublicUser(user) };
  }

  async signToken(sub: string, email: string, name: string) {
    return await this.jwt.signAsync(
      { sub, email, name },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      },
    );
  }

  buildPublicUser(user: any) {
    const { id, email, firstName, lastName, createdAt, updatedAt } = user;
    return { id, email, firstName, lastName, createdAt, updatedAt };
  }
}
