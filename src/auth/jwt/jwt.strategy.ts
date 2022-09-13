import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Payload } from './jwt.payload';

@Injectable()
export class JwtStrtegy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey',
    });
  }

  async validate(payload: Payload) {
    const user = await this.usersRepository.findOne({
      select: { password: false },
      where: { id: parseInt(payload.sub) },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Controller에서 @Req를 주입받으면 여기서 반환한 user를 사용할 수 있다.
    return user;
  }
}
