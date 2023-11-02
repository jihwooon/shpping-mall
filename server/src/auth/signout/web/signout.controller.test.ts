import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { SignoutController } from './signout.controller'
import { SignoutService } from '../application/signout.service'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../database/constants'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { Response } from 'express'
import { TokenIssuer } from '../../token/application/token.issuer'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'
import { jwtTokenFixture } from '../../../fixture/jwtTokenFixture'

describe('SignoutController class', () => {
  let signoutController: SignoutController
  let signoutService: SignoutService
  let connection: Connection

  const HEADERS = {
    authorization: 'Bearer ' + jwtTokenFixture().accessToken,
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
        TokenIssuer,
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
    beforeEach(() => {
      signoutService.logout = jest.fn().mockResolvedValue(true)
    })
    context('accessToken이 주어지고 요청이 성공하면', () => {
      it('logout success를 리턴해야 한다', async () => {
        const response = await signoutController.signoutHandler(HEADERS, responseMock)

        expect(response).toEqual('logout success')
      })
    })

    context('accessToken을 인증 할 수 없으면', () => {
      beforeEach(() => {
        signoutService.logout = jest.fn().mockRejectedValue(new MemberNotFoundException('회원 정보를 찾을 수 없습니다'))
      })
      it('MemberNotFoundException을 던져야 한다', async () => {
        expect(signoutController.signoutHandler(HEADERS, responseMock)).rejects.toThrow(
          new MemberNotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })
  })
})
