import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async signup(loginRequestDto: LoginRequestDto) {
    const { email, password } = loginRequestDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersRepository.save({
      email,
      password: hashedPassword,
    });
  }

  async findUserBySub(jwtSub: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      select: { password: false },
      where: { id: parseInt(jwtSub), isDeleted: false },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
