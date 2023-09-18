import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { MemberRepository } from '../src/members/domain/member.repository'
import { MYSQL_CONNECTION } from '../src/config/database/constants'
import { Connection } from 'mysql2/promise'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { TokenController } from '../src/auth/token/web/token.controller'
import { TokenIssuer } from '../src/auth/token/application/token.issuer'

describe('TokenController (e2e)', () => {
  let app: INestApplication
  let tokenController: TokenController
  let connection: Connection
  let tokenIssuer: TokenIssuer

  const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk0MzI3MTcwLCJleHAiOjE2OTQ0MTM1NzB9.6UXhpwHPB9W1ZtFZJQfiMANMinEt3WUULdwLSJKQ_z0'
  const ACCESS_TOKEN_EXPIRE = new Date(Date.now() + 86400000).toISOString()
  const REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQ1MjI0NzUsImV4cCI6MTY5NTczMjA3NSwic3ViIjoiUkVGUkVTSCJ9.A2PfZdj91q6MIapXrvTB6bUd7blhqrrDY2yh0eYdGPY'

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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

    tokenIssuer = moduleFixture.get<TokenIssuer>(TokenIssuer)
    app = moduleFixture.createNestApplication()

    await app.init()
  })

  describe('POST /auth/token', () => {
    beforeEach(() => {
      tokenIssuer.createAccessTokenByRefreshToken = jest.fn().mockResolvedValue({
        accessToken: ACCESS_TOKEN,
        accessTokenExpireTime: ACCESS_TOKEN_EXPIRE,
      })
    })

    context('Authorization header에 refresh token이 주어지면', () => {
      it('상태코드 201를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/token')
          .set('Authorization', 'Bearer ' + REFRESH_TOKEN)

        expect(status).toEqual(201)
        expect(body).toEqual({
          accessToken: ACCESS_TOKEN,
          accessTokenExpireTime: ACCESS_TOKEN_EXPIRE,
        })
      })
    })
  })
})
