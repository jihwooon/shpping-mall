import { Test, TestingModule } from '@nestjs/testing'
import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { MemberRepository } from './member.repository'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { FIND_BY_EMAIL, MEMBER } from '../../fixture/memberFixture'
import { MemberType } from './member-type.enum'
import { Role } from './member-role.enum'

describe('MemberRepository class', () => {
  let connection: Connection
  let memberRepository: MemberRepository
  const REGISTERED_EMAIL = 'abc@email.com'
  const UNSUBSCRIBED_EMAIL = 'xxxx@email.com'

  connection = {
    execute: jest.fn(),
  } as unknown as Connection

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberRepository,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    memberRepository = module.get<MemberRepository>(MemberRepository)
  })

  describe('save method', () => {
    context('member 정보가 저장에 성공하면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ insertId: 1 }] as ResultSetHeader[])
      })
      it('생성 된 insertId를 리턴해야 한다', async () => {
        const insertId = await memberRepository.save(MEMBER)

        expect(insertId).toEqual(1)
      })
    })

    context('member 정보가 저장에 실패하면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ insertId: 0 }] as ResultSetHeader[])
      })
      it('undefined를 리턴해야 한다', async () => {
        const insertId = await memberRepository.save(MEMBER)

        expect(insertId).toEqual(undefined)
      })
    })
  })

  describe('findByEmail method', () => {
    context('찾을 수 있는 email이 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[FIND_BY_EMAIL] as RowDataPacket[], []])
      })
      it('member 정보를 리턴해야 한다', async () => {
        const member = await memberRepository.findByEmail(REGISTERED_EMAIL)

        expect(member).toEqual({
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
        })
      })
    })

    context('찾을 수 없는 email이 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[undefined] as RowDataPacket[], []])
      })
      it('undefined를 리턴해야 한다', async () => {
        const member = await memberRepository.findByEmail(REGISTERED_EMAIL)

        expect(member).toEqual(undefined)
      })
    })
  })

  describe('existsByEmail method', () => {
    context('가입 된 email이 존재하면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[{ emailCount: 1 }] as RowDataPacket[], []])
      })
      it('true를 리턴해야 한다', async () => {
        const exitedEmail = await memberRepository.existsByEmail(REGISTERED_EMAIL)

        expect(exitedEmail).toEqual(true)
      })
    })

    context('가입 된 email이 존재하지 않으면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[{ emailCount: 0 }] as RowDataPacket[], []])
      })
      it('false를 리턴해야 한다', async () => {
        const exitedEmail = await memberRepository.existsByEmail(UNSUBSCRIBED_EMAIL)

        expect(exitedEmail).toEqual(false)
      })
    })
  })
})
