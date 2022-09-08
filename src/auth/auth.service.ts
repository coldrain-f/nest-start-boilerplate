import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginRequestDto } from './dto/login.request.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto) {
    const { email, password } = data;

    //* 이메일이 있는지 체크
    const user = await this.usersRepository.findOne({
      where: { email, isDeleted: false },
    });

    if (!user) {
      throw new UnauthorizedException('이메일을 확인해 주세요.');
    }

    //* 비밀번호가 일치하는지 체크
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해 주세요.');
    }

    const payload = { email, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
