import { Test, TestingModule } from '@nestjs/testing'
import { Connection, RowDataPacket } from 'mysql2/promise'
import { MemberRepository } from './member.repository'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { DB_MEMBER_RESPONSE } from '../../fixture/memberFixture'
import { MemberType } from './member-type.enum'
import { Role } from './member-role.enum'

describe('MemberRepository class', () => {
  let connection: Connection
  let memberRepository: MemberRepository
  const REGISTERED_EMAIL = 'abc@email.com'

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

  describe('findByEmail method', () => {
    context('찾을 수 있는 email이 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[DB_MEMBER_RESPONSE] as RowDataPacket[], []])
      })
      it('member 정보를 리턴해야 한다', async () => {
        const member = await memberRepository.findByEmail(REGISTERED_EMAIL)

        expect(member).toEqual({
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
})
