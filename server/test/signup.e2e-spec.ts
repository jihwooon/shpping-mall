import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { SignupController } from '../src/auth/signup/web/signup.controller'
import { SignupService } from '../src/auth/signup/application/signup.service'
import { EmailChecker } from '../src/members/application/email.checker'
import { MemberRepository } from '../src/members/domain/member.repository'
import { MYSQL_CONNECTION } from '../src/config/database/constants'
import { Connection } from 'mysql2/promise'
import {
  CREATE_EMPTY_NAME_REQUEST,
  CREATE_LONG_EMAIL_REQUEST,
  CREATE_NOT_EMAIL_REQUEST,
  CREATE_NOT_EMPTY_PASSWORD_REQUEST,
  CREATE_NOT_ERROR_REQUEST,
  CREATE_NOT_STRING_EMAIL_REQUEST,
  CREATE_NOT_STRING_PASSWORD_REQUEST,
  CREATE_UNDER_8_LENGTH_PASSWORD_REQUEST,
  CREATE_UP_16_LENGTH_PASSWORD_REQUEST,
  REQUEST_BODY,
} from '../src/fixture/memberFixture'

describe('SignupController (e2e)', () => {
  let app: INestApplication
  let connection: Connection
  let signupController: SignupController
  let signupService: SignupService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SignupController],
      providers: [
        SignupService,
        EmailChecker,
        MemberRepository,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    signupController = moduleFixture.get<SignupController>(SignupController)
    signupService = moduleFixture.get<SignupService>(SignupService)

    app = moduleFixture.createNestApplication()

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )

    await app.init()
  })

  describe('POST /auth/signup', () => {
    context('회원가입 정보가 주어지면', () => {
      beforeEach(() => {
        signupService.signup = jest.fn().mockImplementation(() => 1)
      })
      it('상태코드 201를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(REQUEST_BODY)

        expect(status).toEqual(201)
      })
    })

    context('이메일을 누락하면', () => {
      beforeEach(() => {
        signupService.signup = jest.fn().mockImplementation(() => 1)
      })
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(CREATE_NOT_EMAIL_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: [
            'email must be a string',
            '이메일은 60자 이하로 입력해주세요.',
            '올바른 이메일 형식을 입력하세요.',
            '이메일은 필수 입력 값입니다.',
          ],
          statusCode: 400,
        })
      })
    })

    context('이메일 형식이 맞지 않으면', () => {
      beforeEach(() => {
        signupService.signup = jest.fn().mockImplementation(() => 1)
      })
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(CREATE_NOT_ERROR_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['올바른 이메일 형식을 입력하세요.'],
          statusCode: 400,
        })
      })
    })

    context('이메일 글자 수 60자가 넘으면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(CREATE_LONG_EMAIL_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['이메일은 60자 이하로 입력해주세요.'],
          statusCode: 400,
        })
      })
    })

    context('이메일 형식이 문자열이 아니면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(CREATE_NOT_STRING_EMAIL_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['올바른 이메일 형식을 입력하세요.'],
          statusCode: 400,
        })
      })
    })

    context('패스워드를 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(CREATE_NOT_EMPTY_PASSWORD_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['비밀번호는 8자 이상 16이하로 입력해주세요.', '비밀번호는 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })

    context('패스워드 길이가 8자리 이하이면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(CREATE_UNDER_8_LENGTH_PASSWORD_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['비밀번호는 8자 이상 16이하로 입력해주세요.'],
          statusCode: 400,
        })
      })
    })

    context('패스워드 길이가 16자리 이상이면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(CREATE_UP_16_LENGTH_PASSWORD_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['비밀번호는 8자 이상 16이하로 입력해주세요.'],
          statusCode: 400,
        })
      })
    })

    context('패스워드 형식이 문자열이 아니면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(CREATE_NOT_STRING_PASSWORD_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['비밀번호는 8자 이상 16이하로 입력해주세요.'],
          statusCode: 400,
        })
      })
    })

    context('이름을 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(CREATE_EMPTY_NAME_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['이름은 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })
  })
})
