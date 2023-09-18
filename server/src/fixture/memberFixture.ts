import { Role } from '../members/domain/member-role.enum'
import { MemberType } from '../members/domain/member-type.enum'

export const MEMBER = {
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

export const CREATE_MEMBER_REQUEST = {
  email: 'abc@email.com',
  memberName: '홍길동',
  password: '12345678123456',
}

export const REQUEST_BODY = {
  email: 'abc@email.com',
  memberName: '홍길동',
  password: '12345678123456',
}

export const CREATE_NOT_EMAIL_REQUEST = {
  memberName: '홍길동',
  password: '12345678123456',
}

export const CREATE_NOT_ERROR_REQUEST = {
  email: 'abcd.email.com',
  memberName: '홍길동',
  password: '12345678123456',
}

export const CREATE_LONG_EMAIL_REQUEST = {
  email:
    'abcdefghijklmnopqrabcdefghijklmnopqrabcdefghijklmnopqrabcdefghijklmnopqrabcdefghijklmnopqrabcdefghijklmnopqr@email.com',
  memberName: '홍길동',
  password: '12345678123456',
}

export const CREATE_NOT_STRING_EMAIL_REQUEST = {
  email: 123456,
  memberName: '홍길동',
  password: '12345678123456',
}

export const CREATE_NOT_EMPTY_PASSWORD_REQUEST = {
  email: 'abcd@email.com',
  memberName: '홍길동',
  password: '',
}

export const CREATE_UNDER_8_LENGTH_PASSWORD_REQUEST = {
  email: 'abcd@email.com',
  memberName: '홍길동',
  password: '12345',
}

export const CREATE_UP_16_LENGTH_PASSWORD_REQUEST = {
  email: 'abcd@email.com',
  memberName: '홍길동',
  password: '1234567890123456789012345678901234567890',
}

export const CREATE_NOT_STRING_PASSWORD_REQUEST = {
  email: 'abcd@email.com',
  memberName: '홍길동',
  password: 123456,
}

export const CREATE_EMPTY_NAME_REQUEST = {
  email: 'abcd@email.com',
  memberName: '',
  password: '12345678123456',
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
