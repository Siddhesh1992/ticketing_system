import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET',
    });
  }

  async validate(request: Request, payload) {
    const user = await this.usersService.findOne({ id: payload.sub });
    if (!user) return null;
    console.log(request.url);
    console.log(request.method);
    console.log(user.userType.id);
    const adminRoutes = [
      { route: '/ticket', method: 'GET' },
      { route: '/ticket', method: 'POST' },
      { route: '/ticket', method: 'PUT' },
      { route: '/user', method: 'GET' },
    ];
    const userRoutes = [
      { route: '/ticket', method: 'GET' },
      { route: '/ticket', method: 'PUT' },
    ];

    const findOne = (path) =>
      request.url.includes(path.route) && request.method == path.method;

    if (user.userType.id == 1 && adminRoutes.findIndex(findOne) == -1)
      throw new UnauthorizedException('You cannot access the routes');
    if (user.userType.id == 2 && userRoutes.findIndex(findOne) == -1)
      throw new UnauthorizedException('You cannot access the routes');
    return user.id;
  }
}
