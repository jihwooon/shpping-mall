import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, UnauthorizedException } from '@nestjs/common'
import * as request from 'supertest'
import { MemberRepository } from '../src/members/domain/member.repository'
import { MYSQL_CONNECTION } from '../src/config/database/constants'
import { Connection } from 'mysql2/promise'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { TokenController } from '../src/auth/token/web/token.controller'
import { TokenIssuer } from '../src/auth/token/application/token.issuer'
import { jwtTokenFixture } from '../src/fixture/jwtTokenFixture'
import { MemberNotFoundException } from '../src/members/application/error/member-not-found.exception'
import { TokenExpiredException } from '../src/auth/token/error/token_expired.exception'

describe('TokenController (e2e)', () => {
  let app: INestApplication
  let connection: Connection
  let tokenIssuer: TokenIssuer

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
        accessToken: jwtTokenFixture().accessToken,
        accessTokenExpireTime: jwtTokenFixture().accessTokenExpire,
      })
    })

    context('refresh token이 주어지면', () => {
      it('상태코드 201를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/token')
          .set('Authorization', 'Bearer ' + jwtTokenFixture().refreshToken)

        expect(status).toEqual(201)
        expect(body).not.toEqual({
          accessToken: jwtTokenFixture().accessToken,
          accessTokenExpireTime: jwtTokenFixture().accessTokenExpire,
        })
      })
    })

    context('refresh token이 주어지고 회원 정보를 찾을 수 없으면', () => {
      beforeEach(() => {
        tokenIssuer.createAccessTokenByRefreshToken = jest
          .fn()
          .mockRejectedValue(new MemberNotFoundException('회원 정보를 찾을 수 없습니다'))
      })
      it('상태코드 404를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/token')
          .set('Authorization', 'Bearer ' + jwtTokenFixture().refreshToken)

        expect(status).toEqual(404)
        expect(body).toEqual({
          error: 'MEMBER_NOT_EXITED',
          message: '회원 정보를 찾을 수 없습니다',
          statusCode: 404,
        })
      })
    })

    context('refresh token이 주어지고 검증을 실패하면', () => {
      beforeEach(() => {
        tokenIssuer.createAccessTokenByRefreshToken = jest
          .fn()
          .mockRejectedValue(new UnauthorizedException('인증 할 수 없는 token 입니다'))
      })
      it('상태코드 401를 응답해야 한다', async () => {
        const invalid_refreshToken = (jwtTokenFixture().refreshToken = '0')

        const { status, body } = await request(app.getHttpServer())
          .post('/auth/token')
          .set('Authorization', 'Bearer ' + invalid_refreshToken)

        expect(status).toEqual(401)
        expect(body).toEqual({
          error: 'Unauthorized',
          message: '인증 할 수 없는 token 입니다',
          statusCode: 401,
        })
      })
    })

    context('refresh token이 주어지고 유효기간이 민료가 되면', () => {
      beforeEach(() => {
        tokenIssuer.createAccessTokenByRefreshToken = jest
          .fn()
          .mockRejectedValue(new TokenExpiredException('Refresh Token의 유효기간이 만료되었습니다'))
      })
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/token')
          .set('Authorization', 'Bearer ' + jwtTokenFixture().refreshToken)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'TOKEN_EXPIRED',
          message: 'Refresh Token의 유효기간이 만료되었습니다',
          statusCode: 400,
        })
      })
    })
  })
})
