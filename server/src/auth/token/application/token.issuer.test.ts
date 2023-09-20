import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { TokenIssuer } from './token.issuer'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'
import { userMock } from '../../../fixture/memberFixture'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { TokenExpiredException } from '../error/token_expired.exception'
import { InternalServerErrorException } from '@nestjs/common'

describe('TokenIssuer class', () => {
  let connect: Connection
  let tokenIssuer: TokenIssuer
  let memberRepository: MemberRepository
  let jwtProvider: JwtProvider

  const REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQ1MjI0NzUsImV4cCI6MTY5NTczMjA3NSwic3ViIjoiUkVGUkVTSCJ9.A2PfZdj91q6MIapXrvTB6bUd7blhqrrDY2yh0eYdGPY'
  const NOW = new Date('2023-08-19T04:48:42.487Z')
  const EXPIRED_TIME = new Date('2023-12-01T04:48:42.487Z')

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenIssuer,
        MemberRepository,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connect,
        },
      ],
    }).compile()

    tokenIssuer = module.get<TokenIssuer>(TokenIssuer)
    memberRepository = module.get<MemberRepository>(MemberRepository)
    jwtProvider = module.get<JwtProvider>(JwtProvider)
  })

  describe('createAccessTokenByRefreshToken method', () => {
    context('refreshToken이 주어지면', () => {
      beforeEach(() => {
        memberRepository.findMemberByRefreshToken = jest.fn().mockResolvedValue(userMock())
        jwtProvider.validateToken = jest.fn().mockResolvedValue('abc@gmail.com')
      })
      it('accessToken과 accessTokenExpireTime을 갱신해야 한다', async () => {
        const member = await tokenIssuer.createAccessTokenByRefreshToken(REFRESH_TOKEN, NOW)

        expect(member).not.toEqual({
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiYWJjQGVtYWlsLmNvbSIsImlhdCI6MTY5NTAxMjUyMiwiZXhwIjoxNjk1MDEzMDA5LCJzdWIiOiJBQ0NFU1MifQ.L7Z1BBLh914jOVJ2fyDh0KSeCU61Q6b-_qnrTPglq7U',
          accessTokenExpireTime: new Date('2023-08-19T04:48:42.487Z'),
        })
      })
    })

    context('refreshToken이 찾을 수 없거나 올바르지 않으면', () => {
      beforeEach(() => {
        memberRepository.findMemberByRefreshToken = jest.fn().mockResolvedValue(undefined)
        jwtProvider.validateToken = jest.fn().mockResolvedValue('abc@gmail.com')
      })
      it('MemberNotFoundException를 던져야 한다', async () => {
        expect(tokenIssuer.createAccessTokenByRefreshToken(REFRESH_TOKEN, NOW)).rejects.toThrow(
          new MemberNotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })

    context('refreshToken의 유효기간이 만료 되면', () => {
      beforeEach(() => {
        memberRepository.findMemberByRefreshToken = jest.fn().mockResolvedValue(userMock())
        jwtProvider.validateToken = jest.fn().mockResolvedValue('abc@gmail.com')
      })
      it('TokenExpiredException를 던져야 한다', async () => {
        expect(tokenIssuer.createAccessTokenByRefreshToken(REFRESH_TOKEN, EXPIRED_TIME)).rejects.toThrow(
          new TokenExpiredException('Refresh Token의 유효기간이 만료되었습니다'),
        )
      })
    })
  })

  describe('updateRefreshTokenAndExpirationTime method', () => {
    context('token과 회원 정보가 주어지고 변경이 성공하면', () => {
      beforeEach(() => {
        memberRepository.updateMemberByRefreshTokenAndExpirationTime = jest.fn().mockResolvedValue(true)
      })
      it('true를 리턴해야 한다', async () => {
        const updatedToken = await tokenIssuer.updateRefreshTokenAndExpirationTime(REFRESH_TOKEN, userMock())

        expect(updatedToken).toEqual(true)
      })
    })

    context('token과 회원 정보가 주어지고 변경이 실패하면', () => {
      beforeEach(() => {
        memberRepository.updateMemberByRefreshTokenAndExpirationTime = jest.fn().mockResolvedValue(false)
      })
      it('InternalServerErrorException를 던져야 한다', async () => {
        expect(tokenIssuer.updateRefreshTokenAndExpirationTime(REFRESH_TOKEN, userMock())).rejects.toThrow(
          new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'),
        )
      })
    })
  })
})
