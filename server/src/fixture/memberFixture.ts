import { Role } from '../members/domain/member-role.enum'
import { MemberType } from '../members/domain/member-type.enum'
import { Member } from '../members/domain/member.entity'

export const userMock = (): Member => {
  return {
    memberId: 1,
    email: 'abc@email.com',
    memberName: '홍길동',
    memberType: MemberType.GENERAL,
    password: '$2b$10$nEU5CvDwcTwsMfZeiRv6UeYxh.Zp796RXh170vrRVPP.w0en8696K',
    refreshToken: 'eyJhbGciOiJI',
    tokenExpirationTime: new Date('2023-09-01T23:10:00.009Z'),
    role: Role.USER,
    createTime: new Date('2023-09-01T23:10:00.009Z'),
    updateTime: new Date('2023-09-01T23:10:00.009Z'),
    createBy: '홍길동',
    modifiedBy: '김철수',
  }
}

export const RESPONSE_MEMBER = {
  member_id: 1,
  email: 'abc@email.com',
  member_name: '홍길동',
  member_type: MemberType.GENERAL,
  password: '$2b$10$nEU5CvDwcTwsMfZeiRv6UeYxh.Zp796RXh170vrRVPP.w0en8696K',
  refresh_token: 'eyJhbGciOiJI',
  token_expiration_time: new Date('2023-09-01T23:10:00.009Z'),
  role: Role.USER,
  create_time: new Date('2023-09-01T23:10:00.009Z'),
  update_time: new Date('2023-09-01T23:10:00.009Z'),
  create_by: '홍길동',
  modified_by: '김철수',
}
