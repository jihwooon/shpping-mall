import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { PasswordProvider } from '../../../members/application/password.provider'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { SigninService } from '../application/signin.service'
import { SigninController } from './signin.controller'

describe('SignInController class', () => {
  let signinController: SigninController
  let signinService: SigninService
  let connection: Connection

  const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk0MzI3MTcwLCJleHAiOjE2OTQ0MTM1NzB9.6UXhpwHPB9W1ZtFZJQfiMANMinEt3WUULdwLSJKQ_z0'
  const REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjo0NSwiaWF0IjoxNjk0NTIyODc2LCJleHAiOjE2OTU3MzI0NzYsInN1YiI6IlJFRlJFU0gifQ.HQc7pLeiMFtL-phEICVtulH8qraSA23toTfcehYvy4Y'
  const ACCESS_TOKEN_EXPIRE = new Date(Date.now() + 86400000)
  const REFRESH_TOKEN_EXPIRE = new Date(Date.now() + 1210500000)

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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

    signinController = app.get<SigninController>(SigninController)
    signinService = app.get<SigninService>(SigninService)
  })

  describe('signinHandler method', () => {
    beforeEach(() => {
      signinService.login = jest.fn().mockResolvedValue({
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
        accessTokenExpireTime: ACCESS_TOKEN_EXPIRE,
        refreshTokenExpireTime: REFRESH_TOKEN_EXPIRE,
      })
    })
    context('이메일과 패스워드를 입력하면 ', () => {
      it('사용자 Token 정보를 리턴해야 한다', async () => {
        const responseDto = await signinController.signinHandler({ email: 'abc@email.com', password: '1234456' })

        expect(responseDto).toEqual({
          accessToken: ACCESS_TOKEN,
          refreshToken: REFRESH_TOKEN,
          accessTokenExpireTime: ACCESS_TOKEN_EXPIRE,
          refreshTokenExpireTime: REFRESH_TOKEN_EXPIRE,
        })
      })
    })
  })
})
