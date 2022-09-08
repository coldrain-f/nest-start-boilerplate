import { Injectable } from '@nestjs/common';
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
}
