import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { TokenIssuer } from './token.issuer'
import { MemberRepository } from '../domain/member.repository'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { RefreshTokenNotFoundException } from './error/refresh-token-not-found.exception'
import { RESPONSE_MEMBER } from '../../fixture/memberFixture'
import { JwtProvider } from '../../jwt/jwt.provider'

describe('TokenIssuer class', () => {
  let connect: Connection
  let tokenIssuer: TokenIssuer
  let memberRepository: MemberRepository

  const REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQ1MjI0NzUsImV4cCI6MTY5NTczMjA3NSwic3ViIjoiUkVGUkVTSCJ9.A2PfZdj91q6MIapXrvTB6bUd7blhqrrDY2yh0eYdGPY'
  const NOW = new Date('2023-09-19T04:48:42.487Z')

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
  })

  describe('createAccessTokenByRefreshToken method', () => {
    context('refreshToken이 주어지면', () => {
      beforeEach(() => {
        memberRepository.findMemberByRefreshToken = jest.fn().mockResolvedValue(RESPONSE_MEMBER)
      })
      it('accessToken과 accessToken ExpireTime을 리턴해야 한다', async () => {
        const member = await tokenIssuer.createAccessTokenByRefreshToken(REFRESH_TOKEN, NOW)

        expect(member).not.toEqual({
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiYWJjQGVtYWlsLmNvbSIsImlhdCI6MTY5NTAxMjUyMiwiZXhwIjoxNjk1MDEzMDA5LCJzdWIiOiJBQ0NFU1MifQ.L7Z1BBLh914jOVJ2fyDh0KSeCU61Q6b-_qnrTPglq7U',
          accessTokenExpireTime: NOW,
        })
      })
    })

    context('refreshToken이 존재하지 않으면', () => {
      beforeEach(() => {
        memberRepository.findMemberByRefreshToken = jest.fn().mockResolvedValue(undefined)
      })
      it('RefreshTokenNotFoundException를 던져야 한다', async () => {
        expect(tokenIssuer.createAccessTokenByRefreshToken(REFRESH_TOKEN, NOW)).rejects.toThrow(
          new RefreshTokenNotFoundException('Refresh Token 정보를 찾을 수 없습니다'),
        )
      })
    })
  })
})
