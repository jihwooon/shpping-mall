import { Role } from '../members/domain/member-role.enum'
import { MemberType } from '../members/domain/member-type.enum'

export const MEMBER = {
  memberId: 1,
  email: 'abc@email.com',
  memberName: '홍길동',
  memberType: MemberType.GENERAL,
  password: '12345678',
  refreshToken: 'eyJhbGciOiJI',
  tokenExpirationTime: new Date('2023-09-01T23:10:00.009Z'),
  role: Role.USER,
  createTime: new Date('2023-09-01T23:10:00.009Z'),
  updateTime: new Date('2023-09-01T23:10:00.009Z'),
  createBy: '홍길동',
  modifiedBy: '김철수',
}

export const DB_MEMBER_EMAIL_RESPONSE = {
  email: 'abc@email.com',
}

export const CREATE_MEMBER_REQUEST = {
  email: 'abc@email.com',
  memberName: '홍길동',
  password: '12345678123456',
}
