import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, UnauthorizedException } from '@nestjs/common'
import * as request from 'supertest'
import { MemberRepository } from '../src/members/domain/member.repository'
import { MYSQL_CONNECTION } from '../src/config/database/constants'
import { Connection } from 'mysql2/promise'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { SignoutController } from '../src/auth/signout/web/signout.controller'
import { SignoutService } from '../src/auth/signout/application/signout.service'

describe('SignoutController (e2e)', () => {
  let app: INestApplication
  let connection: Connection
  let signoutService: SignoutService

  const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk0MzI3MTcwLCJleHAiOjE2OTQ0MTM1NzB9.6UXhpwHPB9W1ZtFZJQfiMANMinEt3WUULdwLSJKQ_z0'
  const INVALID_ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk0MzI3MTcwLCJleHAiOjE2OTQ0MTM1NzB9.6UXhpwHPB9W1ZtFZJQfiMANMinEt3WUULdwLSJKQ123'

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SignoutController],
      providers: [
        SignoutService,
        MemberRepository,
        JwtProvider,
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
    context('Authorization header에 accessToken이 주어지면', () => {
      beforeEach(() => {
        signoutService.logout = jest.fn().mockResolvedValue(true)
      })
      it('상태코드 201를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signout')
          .set('Authorization', 'Bearer ' + ACCESS_TOKEN)

        expect(status).toEqual(201)
        expect(body).toEqual('logout success')
      })
    })

    context('Authorization header에 accessToken이 없으면', () => {
      beforeEach(() => {
        signoutService.logout = jest.fn().mockRejectedValue(new UnauthorizedException('인증 할 수 없는 token 입니다'))
      })
      it('상태코드 401를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signout')
          .set('Authorization', 'Bearer ' + INVALID_ACCESS_TOKEN)

        expect(status).toEqual(401)
        expect(body).toEqual({ error: 'Unauthorized', message: '인증 할 수 없는 token 입니다', statusCode: 401 })
      })
    })
  })
})
