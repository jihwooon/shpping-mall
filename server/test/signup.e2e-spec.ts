import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { SignupController } from '../src/auth/signup/web/signup.controller'
import { SignupService } from '../src/auth/signup/application/signup.service'
import { EmailChecker } from '../src/members/application/email.checker'
import { MemberRepository } from '../src/members/domain/member.repository'
import { MYSQL_CONNECTION } from '../src/database/constants'
import { Connection } from 'mysql2/promise'
import { userMock } from '../src/fixture/memberFixture'
import { PasswordProvider } from '../src/members/application/password.provider'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { CreateMemberDto } from '../src/members/dto/create-member.dto'

describe('SignupController (e2e)', () => {
  let app: INestApplication
  let connection: Connection
  let signupService: SignupService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SignupController],
      providers: [
        SignupService,
        EmailChecker,
        MemberRepository,
        PasswordProvider,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

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
    beforeEach(() => {
      signupService.signup = jest.fn().mockImplementation(() => userMock().memberId)
    })

    context('회원가입 정보가 주어지면', () => {
      it('상태코드 201를 응답해야 한다', async () => {
        const raw_password = '1234566789'
        const signupRequest: CreateMemberDto = {
          email: userMock().email,
          password: (userMock().password = raw_password),
          memberName: userMock().memberName,
        }

        const {
          status,
          body: { id },
        } = await request(app.getHttpServer()).post('/auth/signup').send(signupRequest)

        expect(status).toEqual(201)
        expect(id).toEqual(userMock().memberId)
      })
    })

    context('이메일을 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const blank_email = ''
        const raw_password = '1234566789'
        const signupRequest: CreateMemberDto = {
          email: blank_email,
          password: (userMock().password = raw_password),
          memberName: userMock().memberName,
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(signupRequest)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['올바른 이메일 형식을 입력하세요.', '이메일은 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })

    context('이메일 형식이 맞지 않으면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const wrong_email = 'abcd.email.com'
        const raw_password = '1234566789'
        const signupRequest: CreateMemberDto = {
          email: (userMock().email = wrong_email),
          password: (userMock().password = raw_password),
          memberName: userMock().memberName,
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(signupRequest)

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
        const long_email =
          'abcdefghijklmnopqrabcdefghijklmnopqrabcdefghijklmnopqrabcdefghijklmnopqrabcdefghijklmnopqrabcdefghijklmnopqr@email.com'
        const raw_password = '1234566789'
        const signupRequest: CreateMemberDto = {
          email: (userMock().email = long_email),
          password: (userMock().password = raw_password),
          memberName: userMock().memberName,
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(signupRequest)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['이메일은 60자 이하로 입력해주세요.'],
          statusCode: 400,
        })
      })
    })

    context('패스워드를 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const blank_password = ''
        const signupRequest: CreateMemberDto = {
          email: userMock().email,
          password: (userMock().password = blank_password),
          memberName: userMock().memberName,
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(signupRequest)

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
        const under_length_password = '0'
        const signupRequest: CreateMemberDto = {
          email: userMock().email,
          password: (userMock().password = under_length_password),
          memberName: userMock().memberName,
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(signupRequest)

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
        const long_password = '1234567890123456789012345678901234567890'
        const signupRequest: CreateMemberDto = {
          email: userMock().email,
          password: (userMock().password = long_password),
          memberName: userMock().memberName,
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(signupRequest)

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
        const blank_name = ''
        const raw_password = '1234566789'
        const signupRequest: CreateMemberDto = {
          email: userMock().email,
          password: (userMock().password = raw_password),
          memberName: (userMock().memberName = blank_name),
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signup').send(signupRequest)

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
