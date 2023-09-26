import { SetMetadata } from '@nestjs/common'
import { Role } from '../../members/domain/member-role.enum'

export const Roles = (roles: Role) => SetMetadata('roles', roles)
