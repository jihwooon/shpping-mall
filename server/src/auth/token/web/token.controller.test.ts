import { Test, TestingModule } from '@nestjs/testing'

import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { TokenController } from './token.controller'
import { TokenIssuer } from '../application/token.issuer'

describe('TokenController class', () => {
  let tokenController: TokenController
  let connection: Connection
  let tokenIssuer: TokenIssuer

  const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk0MzI3MTcwLCJleHAiOjE2OTQ0MTM1NzB9.6UXhpwHPB9W1ZtFZJQfiMANMinEt3WUULdwLSJKQ_z0'
  const ACCESS_TOKEN_EXPIRE = new Date(Date.now() + 86400000)
  const HEADERS = {
    authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQ1MjI0NzUsImV4cCI6MTY5NTczMjA3NSwic3ViIjoiUkVGUkVTSCJ9.A2PfZdj91q6MIapXrvTB6bUd7blhqrrDY2yh0eYdGPY',
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        TokenIssuer,
        MemberRepository,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    tokenController = app.get<TokenController>(TokenController)
    tokenIssuer = app.get<TokenIssuer>(TokenIssuer)
  })

  describe('createAccessTokenByRefreshTokenHandler method', () => {
    context('headers에 RefreshToken이 주어지면', () => {
      beforeEach(() => {
        tokenIssuer.createAccessTokenByRefreshToken = jest.fn().mockResolvedValue({
          accessToken: ACCESS_TOKEN,
          accessTokenExpireTime: ACCESS_TOKEN_EXPIRE,
        })
      })
      it('AccessToken과 AccessTokenExpireTime을 리턴 해야 한다', async () => {
        const tokenResponseDto = await tokenController.createAccessTokenByRefreshTokenHandler(HEADERS)

        expect(tokenResponseDto).toEqual({
          accessToken: ACCESS_TOKEN,
          accessTokenExpireTime: ACCESS_TOKEN_EXPIRE,
        })
      })
    })
  })
})
