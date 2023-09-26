import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string>('roles', context.getHandler())

    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    return this.matchRoles(roles, user.role)
  }

  private matchRoles(roles: string, user: any): boolean {
    if (roles != user) {
      throw new ForbiddenException('접근 할 수 없는 권한입니다')
    }

    return true
  }
}
