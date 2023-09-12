import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { MemberRepository } from '../src/members/domain/member.repository'
import { MYSQL_CONNECTION } from '../src/config/database/constants'
import { Connection } from 'mysql2/promise'
import { PasswordProvider } from '../src/members/application/password.provider'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { SigninController } from '../src/auth/signin/web/signin.controller'
import { SigninService } from '../src/auth/signin/application/signin.service'

describe('SigninController (e2e)', () => {
  let app: INestApplication
  let connection: Connection
  let signinService: SigninService

  const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk0MzI3MTcwLCJleHAiOjE2OTQ0MTM1NzB9.6UXhpwHPB9W1ZtFZJQfiMANMinEt3WUULdwLSJKQ_z0'

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

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )

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
          email: 'abc@email.com',
          password: '12345678123456',
        })

        expect(status).toEqual(200)
        expect(body).toEqual({
          accessToken: ACCESS_TOKEN,
        })
      })
    })

    context('패스워드를 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send({
          email: 'abc@email.com',
        })

        expect(status).toEqual(400)
        expect(body).toEqual({
          message: ['비밀번호는 필수 입력 값입니다.'],
          error: 'Bad Request',
          statusCode: 400,
        })
      })
    })

    context('이메일 형식이 맞지 않으면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send({
          email: 'abcd.email.com',
          password: '1234456',
        })

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['올바른 이메일 형식을 입력하세요.'],
          statusCode: 400,
        })
      })
    })

    context('이메일을 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send({
          password: '1234456',
        })

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['email must be a string', '올바른 이메일 형식을 입력하세요.', '이메일은 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })
  })
})
