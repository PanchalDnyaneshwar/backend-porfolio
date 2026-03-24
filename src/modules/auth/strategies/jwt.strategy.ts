import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { AdminUserService } from '../../admin-user/admin-user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly adminUserService: AdminUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwtSecret')!,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.adminUserService.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Unauthorized access');
    }

    return {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
}
