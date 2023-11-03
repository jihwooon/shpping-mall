import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import * as request from 'supertest'
import { MemberRepository } from '../src/members/domain/member.repository'
import { MYSQL_CONNECTION } from '../src/database/constants'
import { Connection } from 'mysql2/promise'
import { PasswordProvider } from '../src/members/application/password.provider'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { SigninController } from '../src/auth/signin/web/signin.controller'
import { SigninService } from '../src/auth/signin/application/signin.service'
import { TokenIssuer } from '../src/auth/token/application/token.issuer'
import { MemberNotFoundException } from '../src/members/application/error/member-not-found.exception'
import { jwtTokenFixture } from '../fixture/jwtTokenFixture'
import { userMock } from '../fixture/memberFixture'
import { LoginMemberDto } from '../src/members/dto/login-member.dto'
import { SigninResponseDto } from '../src/auth/signin/dto/signin-response.dto'

describe('SigninController (e2e)', () => {
  let app: INestApplication
  let connection: Connection
  let signinService: SigninService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SigninController],
      providers: [
        SigninService,
        MemberRepository,
        PasswordProvider,
        JwtProvider,
        TokenIssuer,
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
    const loginResponse: SigninResponseDto = {
      accessToken: jwtTokenFixture().accessToken,
      refreshToken: jwtTokenFixture().refreshToken,
      accessTokenExpireTime: jwtTokenFixture().accessTokenExpire,
      refreshTokenExpireTime: jwtTokenFixture().refreshTokenExpire,
    }

    beforeEach(() => {
      signinService.login = jest.fn().mockResolvedValue(loginResponse)
    })

    context('올바른 이메일과 패스워드를 입력하면', () => {
      it('상태코드 200를 응답해야 한다', async () => {
        const loginRequest: LoginMemberDto = {
          email: userMock().email,
          password: userMock().password,
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send(loginRequest)

        expect(status).toEqual(200)
        expect(body).not.toEqual(loginResponse)
      })
    })

    context('올바르지 않는 이메일과 패스워드가 입력하면', () => {
      beforeEach(() => {
        signinService.login = jest.fn().mockRejectedValue(new MemberNotFoundException('회원 정보를 찾을 수 없습니다'))
      })
      it('상태코드 404를 응답해야 한다', async () => {
        const wrong_email = 'efghjn@email.com'
        const wrong_password = '99999999999'
        const loginRequest: LoginMemberDto = {
          email: (userMock().email = wrong_email),
          password: (userMock().password = wrong_password),
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send(loginRequest)

        expect(status).toEqual(404)
        expect(body).toEqual({
          error: 'MEMBER_NOT_EXITED',
          message: '회원 정보를 찾을 수 없습니다',
          statusCode: 404,
        })
      })
    })

    context('token과 회원 정보가 주어지고 변경이 실패하면', () => {
      beforeEach(() => {
        signinService.login = jest
          .fn()
          .mockRejectedValue(new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'))
      })
      it('상태코드 500를 응답해야 한다', async () => {
        const loginRequest: LoginMemberDto = {
          email: userMock().email,
          password: userMock().password,
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send(loginRequest)

        expect(status).toEqual(500)
        expect(body).toEqual({
          error: 'Internal Server Error',
          message: '예기치 못한 서버 오류가 발생했습니다',
          statusCode: 500,
        })
      })
    })

    context('패스워드가 올바르지 않으면', () => {
      beforeEach(() => {
        signinService.login = jest.fn().mockRejectedValue(new BadRequestException('패스워드가 일치 하지 않습니다'))
      })
      it('상태코드 400를 응답해야 한다', async () => {
        const wrong_password = '99999999999'
        const loginRequest: LoginMemberDto = {
          email: userMock().email,
          password: (userMock().password = wrong_password),
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send(loginRequest)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: '패스워드가 일치 하지 않습니다',
          statusCode: 400,
        })
      })
    })

    context('패스워드를 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const blank_password = ''
        const loginRequest: LoginMemberDto = {
          email: userMock().email,
          password: (userMock().password = blank_password),
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send(loginRequest)

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
        const wrong_email = 'abcd.email.com'
        const loginRequest: LoginMemberDto = {
          email: (userMock().email = wrong_email),
          password: userMock().password,
        }

        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send(loginRequest)

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
        const blank_email = ''
        const loginRequest: LoginMemberDto = {
          email: (userMock().email = blank_email),
          password: userMock().password,
        }
        const { status, body } = await request(app.getHttpServer()).post('/auth/signin').send(loginRequest)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['올바른 이메일 형식을 입력하세요.', '이메일은 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })
  })
})
