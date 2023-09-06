import { Role } from '../users/domain/member-role.enum'
import { MemberType } from '../users/domain/member-type.enum'

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

export const DB_MEMBER_RESPONSE = {
  member_id: 1,
  email: 'abc@email.com',
  member_name: '홍길동',
  member_type: MemberType.GENERAL,
  password: '12345678',
  refresh_token: 'eyJhbGciOiJI',
  token_expiration_time: new Date('2023-09-01T23:10:00.009Z'),
  role: Role.USER,
  create_time: new Date('2023-09-01T23:10:00.009Z'),
  update_time: new Date('2023-09-01T23:10:00.009Z'),
  create_by: '홍길동',
  modified_by: '김철수',
}
