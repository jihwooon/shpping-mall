import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../database/constants'
import { PasswordProvider } from '../../../members/application/password.provider'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { SigninService } from '../application/signin.service'
import { SigninController } from './signin.controller'
import { TokenIssuer } from '../../token/application/token.issuer'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'
import { jwtTokenFixture } from '../../../../fixture/jwtTokenFixture'
import { userMock } from '../../../../fixture/memberFixture'
import { LoginMemberDto } from '../../../members/dto/login-member.dto'
import { SigninResponseDto } from '../dto/signin-response.dto'

describe('SignInController class', () => {
  let signinController: SigninController
  let signinService: SigninService
  let connection: Connection

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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

    signinController = app.get<SigninController>(SigninController)
    signinService = app.get<SigninService>(SigninService)
  })

  describe('signinHandler method', () => {
    context('올바른 이메일과 패스워드를 입력하면 ', () => {
      const loginResponse: SigninResponseDto = {
        accessToken: jwtTokenFixture().accessToken,
        refreshToken: jwtTokenFixture().refreshToken,
        accessTokenExpireTime: jwtTokenFixture().accessTokenExpire,
        refreshTokenExpireTime: jwtTokenFixture().refreshTokenExpire,
      }

      beforeEach(() => {
        signinService.login = jest.fn().mockResolvedValue(loginResponse)
      })
      it('사용자 Token 정보를 리턴해야 한다', async () => {
        const loginRequest: LoginMemberDto = {
          email: userMock().email,
          password: userMock().password,
        }

        const responseDto = await signinController.signinHandler(loginRequest)

        expect(responseDto).toEqual(loginResponse)
      })
    })

    context('올바르지 않는 이메일과 패스워드가 입력하면 ', () => {
      beforeEach(() => {
        signinService.login = jest.fn().mockRejectedValue(new MemberNotFoundException('회원 정보를 찾을 수 없습니다'))
      })
      it('MemberNotFoundException를 던져야 한다', () => {
        const wrong_email = 'efghjn@email.com'
        const wrong_password = '99999999999'
        const loginRequest: LoginMemberDto = {
          email: (userMock().email = wrong_email),
          password: (userMock().password = wrong_password),
        }

        expect(signinController.signinHandler(loginRequest)).rejects.toThrow(
          new MemberNotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })
  })
})
