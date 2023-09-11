import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { MemberRepository } from '../src/members/domain/member.repository'
import { MYSQL_CONNECTION } from '../src/config/database/constants'
import { Connection } from 'mysql2/promise'
import { PasswordProvider } from '../src/members/application/password.provider'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { SigninController } from '../src/auth/signin/web/signin.controller'
import { SigninService } from '../src/auth/signin/application/signin.service'
import { NotFoundException } from '@nestjs/common'

describe('SignupController (e2e)', () => {
  let app: INestApplication
  let connection: Connection

  let signinService: SigninService

  const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk0MzI3MTcwLCJleHAiOjE2OTQ0MTM1NzB9.6UXhpwHPB9W1ZtFZJQfiMANMinEt3WUULdwLSJKQ_z0'

  const EMAIL = 'abc@email.com'
  const PASSWORD = '1234456'

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SigninController],
      providers: [
        SigninService,
        MemberRepository,
        PasswordProvider,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    signinService = moduleFixture.get<SigninService>(SigninService)

    app = moduleFixture.createNestApplication()

    await app.init()
  })

  describe('POST /auth/signin', () => {
    beforeEach(() => {
      signinService.login = jest.fn().mockResolvedValue({
        accessToken: ACCESS_TOKEN,
      })
    })
    context('올바른 이메일과 패스워드를 입력하면', () => {
      it('상태코드 200를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send({
          EMAIL,
          PASSWORD,
        })

        expect(status).toEqual(200)
        expect(body).toEqual({
          accessToken: ACCESS_TOKEN,
        })
      })
    })
    context('이메일이 올바르지 않거나 패스워드가 올바르지 않으면', () => {
      beforeEach(() => {
        signinService.login = jest.fn().mockRejectedValue(new NotFoundException('회원 정보를 찾을 수 없습니다'))
      })
      it('상태코드 404를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send({
          EMAIL,
          PASSWORD,
        })

        expect(status).toEqual(404)
        expect(body).toEqual({
          message: '회원 정보를 찾을 수 없습니다',
          error: 'Not Found',
          statusCode: 404,
        })
      })
    })
  })
})
