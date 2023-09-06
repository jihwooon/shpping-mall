import { Test, TestingModule } from '@nestjs/testing'
import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { MemberRepository } from './member.repository'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { DB_MEMBER_EMAIL_RESPONSE, MEMBER } from '../../fixture/memberFixture'

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
        connection.execute = jest.fn().mockResolvedValue([[DB_MEMBER_EMAIL_RESPONSE] as RowDataPacket[], []])
      })
      it('member 정보를 리턴해야 한다', async () => {
        const member = await memberRepository.findByEmail(REGISTERED_EMAIL)

        expect(member).toEqual({
          email: 'abc@email.com',
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
    context('이미 가입 된 email이 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ fieldCount: 0 }] as ResultSetHeader[])
      })
      it('true를 리턴해야 한다', async () => {
        const exitedEmail = await memberRepository.existsByEmail(REGISTERED_EMAIL)

        expect(exitedEmail).toEqual(true)
      })
    })

    context('email이 가입 되어 있지 않으면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ fieldCount: 1 }] as ResultSetHeader[])
      })
      it('false를 리턴해야 한다', async () => {
        const exitedEmail = await memberRepository.existsByEmail(UNSUBSCRIBED_EMAIL)

        expect(exitedEmail).toEqual(false)
      })
    })
  })
})
