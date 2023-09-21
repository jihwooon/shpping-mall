import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, UnauthorizedException, InternalServerErrorException } from '@nestjs/common'
import * as request from 'supertest'
import { MemberRepository } from '../src/members/domain/member.repository'
import { MYSQL_CONNECTION } from '../src/config/database/constants'
import { Connection } from 'mysql2/promise'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { SignoutController } from '../src/auth/signout/web/signout.controller'
import { SignoutService } from '../src/auth/signout/application/signout.service'
import { TokenIssuer } from '../src/auth/token/application/token.issuer'
import { TokenExpiredException } from '../src/auth/token/error/token_expired.exception'
import { NotAccessTokenTypeException } from '../src/auth/token/error/not-access-token-type.exception'
import { MemberNotFoundException } from '../src/members/application/error/member-not-found.exception'
import { jwtTokenFixture } from '../src/fixture/jwtTokenFixture'

describe('SignoutController (e2e)', () => {
  let app: INestApplication
  let connection: Connection
  let signoutService: SignoutService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SignoutController],
      providers: [
        SignoutService,
        MemberRepository,
        JwtProvider,
        TokenIssuer,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    signoutService = moduleFixture.get<SignoutService>(SignoutService)

    app = moduleFixture.createNestApplication()

    await app.init()
  })

  describe('POST /auth/signout', () => {
    context('AccessToken이 주어지면 요청이 성공하면', () => {
      beforeEach(() => {
        signoutService.logout = jest.fn().mockResolvedValue(true)
      })
      it('상태코드 200를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signout')
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(200)
        expect(body).toEqual('logout success')
      })
    })

    context('AccessToken이 주어지고 인증 할 수 없으면', () => {
      beforeEach(() => {
        signoutService.logout = jest.fn().mockRejectedValue(new UnauthorizedException('인증 할 수 없는 token 입니다'))
      })
      it('상태코드 401를 응답해야 한다', async () => {
        const invalid_access_token = (jwtTokenFixture().accessToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk0MzI3MTcwLCJleHAiOjE2OTQ0MTM1NzB9.6UXhpwHPB9W1ZtFZJQfiMANMinEt3WUULdwLSJKQ123')

        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signout')
          .set('Authorization', 'Bearer ' + invalid_access_token)

        expect(status).toEqual(401)
        expect(body).toEqual({ error: 'Unauthorized', message: '인증 할 수 없는 token 입니다', statusCode: 401 })
      })
    })

    context('AccessToken이 주어지고 유효기간이 만료가 되면', () => {
      beforeEach(() => {
        signoutService.logout = jest
          .fn()
          .mockRejectedValue(new TokenExpiredException('AccessToken 유효기간이 만료되었습니다'))
      })
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signout')
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'TOKEN_EXPIRED',
          message: 'AccessToken 유효기간이 만료되었습니다',
          statusCode: 400,
        })
      })
    })

    context('AccessToken이 주어지고 type이 Access가 아니면', () => {
      beforeEach(() => {
        signoutService.logout = jest
          .fn()
          .mockRejectedValue(new NotAccessTokenTypeException('AccessToken Type이 아닙니다'))
      })
      it('상태코드 401를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signout')
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(401)
        expect(body).toEqual({
          error: 'NOT_ACCESS_TOKEN_TYPE',
          message: 'AccessToken Type이 아닙니다',
          statusCode: 401,
        })
      })
    })

    context('AccessToken이 주어지고 회원 정보를 찾을 수 없으면', () => {
      beforeEach(() => {
        signoutService.logout = jest.fn().mockRejectedValue(new MemberNotFoundException('회원 정보를 찾을 수 없습니다'))
      })
      it('상태코드 404를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signout')
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(404)
        expect(body).toEqual({
          error: 'MEMBER_NOT_EXITED',
          message: '회원 정보를 찾을 수 없습니다',
          statusCode: 404,
        })
      })
    })

    context('AccessToken이 주어지고 변경이 실패하면', () => {
      beforeEach(() => {
        signoutService.logout = jest
          .fn()
          .mockRejectedValue(new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'))
      })
      it('상태코드 500를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signout')
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(500)
        expect(body).toEqual({
          error: 'Internal Server Error',
          message: '예기치 못한 서버 오류가 발생했습니다',
          statusCode: 500,
        })
      })
    })
  })
})
