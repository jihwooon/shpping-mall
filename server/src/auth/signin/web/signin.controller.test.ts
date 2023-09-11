import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { PasswordProvider } from '../../../members/application/password.provider'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { SigninResponseDto } from '../dto/signin-response.dto'
import { SigninService } from '../application/signin.service'
import { SigninController } from './signin.controller'
import { NotFoundException } from '@nestjs/common'

describe('SignInController class', () => {
  let signinController: SigninController
  let signinService: SigninService
  let connection: Connection
  let signinResponse: SigninResponseDto

  let ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk0MzI3MTcwLCJleHAiOjE2OTQ0MTM1NzB9.6UXhpwHPB9W1ZtFZJQfiMANMinEt3WUULdwLSJKQ_z0'
  const req: any = {
    body: { email: 'abc@email.com', password: '1234456' },
  }

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
      })
    })
    context('이메일과 패스워드를 입력하면 ', () => {
      it('accessToken를 리턴해야 한다', async () => {
        const responseDto = await signinController.signinHandler(req)

        expect(responseDto).toEqual({
          accessToken: ACCESS_TOKEN,
        })
      })
    })
    context('이메일과 패스워드를 입력하면 ', () => {
      beforeEach(() => {
        signinService.login = jest.fn().mockRejectedValue(new NotFoundException('회원 정보를 찾을 수 없습니다'))
      })
      it('accessToken를 리턴해야 한다', async () => {
        expect(signinController.signinHandler(req)).rejects.toThrow(
          new NotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })
  })
})
