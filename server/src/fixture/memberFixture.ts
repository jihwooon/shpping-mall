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

export const dbMemberMock = {
  member_id: userMock().memberId,
  email: userMock().email,
  member_name: userMock().memberName,
  member_type: userMock().memberType,
  password: userMock().password,
  refresh_token: userMock().refreshToken,
  token_expiration_time: userMock().tokenExpirationTime,
  role: userMock().role,
  create_time: userMock().createTime,
  update_time: userMock().updateTime,
  create_by: userMock().createBy,
  modified_by: userMock().modifiedBy,
}
