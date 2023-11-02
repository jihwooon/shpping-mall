import { Test, TestingModule } from '@nestjs/testing'
import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { MemberRepository } from './member.repository'
import { MYSQL_CONNECTION } from '../../database/constants'
import { dbMemberMock, userMock } from '../../fixture/memberFixture'

describe('MemberRepository class', () => {
  let connection: Connection
  let memberRepository: MemberRepository

  const REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQ1MjI0NzUsImV4cCI6MTY5NTczMjA3NSwic3ViIjoiUkVGUkVTSCJ9.A2PfZdj91q6MIapXrvTB6bUd7blhqrrDY2yh0eYdGPY'
  const REFRESH_EXPIRE_TIME = new Date('2023-09-28T14:45:55.144Z')
  const WRONG_REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQ1MjI0NzUsImV4cCI6MTY5NTczMjA3NSwic3ViIjoiUkVGUkVTSCJ9.A2PfZdj91q6MIapXrvTB6bUd7blhqrrDY2yh0eYd222'

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
        const insertId = await memberRepository.save(userMock())

        expect(insertId).toEqual(1)
      })
    })

    context('member 정보가 저장에 실패하면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ insertId: 0 }] as ResultSetHeader[])
      })
      it('undefined를 리턴해야 한다', async () => {
        const insertId = await memberRepository.save(userMock())

        expect(insertId).toEqual(undefined)
      })
    })
  })

  describe('findByEmail method', () => {
    context('찾을 수 있는 email이 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[dbMemberMock] as RowDataPacket[], []])
      })
      it('member 정보를 리턴해야 한다', async () => {
        const member = await memberRepository.findByEmail(userMock().email)

        expect(member).toEqual(userMock())
      })
    })

    context('찾을 수 없는 email이 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[undefined] as RowDataPacket[], []])
      })
      it('undefined를 리턴해야 한다', async () => {
        const member = await memberRepository.findByEmail(userMock().email)

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
        const exitedEmail = await memberRepository.existsByEmail(userMock().email)

        expect(exitedEmail).toEqual(true)
      })
    })

    context('가입 된 email이 존재하지 않으면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[{ emailCount: 0 }] as RowDataPacket[], []])
      })
      it('false를 리턴해야 한다', async () => {
        userMock().email = 'xxxx@email.com'
        const exitedEmail = await memberRepository.existsByEmail(userMock().email)

        expect(exitedEmail).toEqual(false)
      })
    })
  })

  describe('updateMemberByRefreshTokenAndExpirationTime method', () => {
    context('email과 refreshToken이 주어지고 변경이 성공하면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }] as ResultSetHeader[])
      })
      it('true를 리턴해야 한다', async () => {
        const updatedToken = await memberRepository.updateMemberByRefreshTokenAndExpirationTime(
          REFRESH_TOKEN,
          REFRESH_EXPIRE_TIME,
          userMock().email,
        )

        expect(updatedToken).toEqual(true)
      })
    })

    context('email과 refreshToken이 주어지고 변경이 실패하면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ affectedRows: 0 }] as ResultSetHeader[])
      })
      it('false를 리턴해야 한다', async () => {
        const memberId = await memberRepository.updateMemberByRefreshTokenAndExpirationTime(
          REFRESH_TOKEN,
          REFRESH_EXPIRE_TIME,
          userMock().email,
        )

        expect(memberId).toEqual(false)
      })
    })
  })

  describe('findMemberByRefreshToken method', () => {
    context('refreshToken이 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[dbMemberMock] as RowDataPacket[], []])
      })
      it('member 정보를 리턴해야 한다', async () => {
        const member = await memberRepository.findMemberByRefreshToken(REFRESH_TOKEN)

        expect(member).toEqual(userMock())
      })
    })

    context('잘못 된 refreshToken이 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[undefined] as RowDataPacket[], []])
      })
      it('undefined를 리턴해야 한다', async () => {
        const member = await memberRepository.findMemberByRefreshToken(WRONG_REFRESH_TOKEN)

        expect(member).toEqual(undefined)
      })
    })
  })
})
