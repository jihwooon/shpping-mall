import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { SignoutController } from './signout.controller'
import { SignoutService } from '../application/signout.service'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { Response } from 'express'

describe('SignoutController class', () => {
  let signoutController: SignoutController
  let signoutService: SignoutService
  let connection: Connection

  const HEADERS = {
    authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQ1MjI0NzUsImV4cCI6MTY5NTczMjA3NSwic3ViIjoiUkVGUkVTSCJ9.A2PfZdj91q6MIapXrvTB6bUd7blhqrrDY2yh0eYdGPY',
  }
  const responseMock = {
    json: jest.fn((x) => x),
  } as unknown as Response

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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

    signoutController = app.get<SignoutController>(SignoutController)
    signoutService = app.get<SignoutService>(SignoutService)
  })

  describe('signoutHandler method', () => {
    context('accessToken이 주어지면', () => {
      beforeEach(() => {
        signoutService.logout = jest.fn().mockResolvedValue(true)
      })
      it('logout success를 리턴해야 한다', async () => {
        const response = await signoutController.signoutHandler(HEADERS, responseMock)

        expect(response).toEqual('logout success')
      })
    })
  })
})
