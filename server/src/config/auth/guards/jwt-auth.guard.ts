import { Request } from 'express'
import { Observable } from 'rxjs'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { JwtProvider } from '../../../jwt/jwt.provider'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtProvider: JwtProvider) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new ForbiddenException('요청에서 인증 토큰을 찾을 수 없습니다')
    }

    try {
      const validateToken = this.jwtProvider.validateToken(token)

      request['user'] = validateToken
    } catch (e) {
      throw new UnauthorizedException('인증 할 수 없는 token 입니다')
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
