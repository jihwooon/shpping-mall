import { Role } from './member-role.enum'
import { MemberType } from './member-type.enum'

export class Member {
  memberId: number

  email: string

  memberName: string

  memberType: MemberType

  password: string

  refreshToken: string

  tokenExpirationTime: Date

  role: Role

  createTime: Date

  updateTime: Date

  createBy: string

  modifiedBy: string

  constructor({
    memberId = 0,
    email = '',
    memberName = '',
    memberType = MemberType.GENERAL,
    password = '',
    refreshToken = '',
    tokenExpirationTime = new Date(),
    role = Role.USER,
    createTime = new Date(),
    updateTime = new Date(),
    createBy = '',
    modifiedBy = '',
  }: {
    memberId?: number
    email?: string
    memberName?: string
    memberType?: MemberType
    password?: string
    refreshToken?: string
    tokenExpirationTime?: Date
    role?: Role
    createTime?: Date
    updateTime?: Date
    createBy?: string
    modifiedBy?: string
  }) {
    this.memberId = memberId
    this.email = email
    this.memberName = memberName
    this.memberType = memberType
    this.password = password
    this.refreshToken = refreshToken
    this.tokenExpirationTime = tokenExpirationTime
    this.role = role
    this.createTime = createTime
    this.updateTime = updateTime
    this.createBy = createBy
    this.modifiedBy = modifiedBy
  }
}
