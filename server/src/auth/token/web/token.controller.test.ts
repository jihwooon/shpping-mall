import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { TokenController } from './token.controller'
import { TokenIssuer } from '../application/token.issuer'
import { jwtTokenFixture } from '../../../fixture/jwtTokenFixture'
import { TokenExpiredException } from '../error/token_expired.exception'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'

describe('TokenController class', () => {
  let tokenController: TokenController
  let connection: Connection
  let tokenIssuer: TokenIssuer

  const HEADERS = {
    authorization: 'Bearer ' + jwtTokenFixture().accessToken,
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        TokenIssuer,
        MemberRepository,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    tokenController = app.get<TokenController>(TokenController)
    tokenIssuer = app.get<TokenIssuer>(TokenIssuer)
  })

  describe('createAccessTokenByRefreshTokenHandler method', () => {
    beforeEach(() => {
      tokenIssuer.createAccessTokenByRefreshToken = jest.fn().mockResolvedValue({
        accessToken: jwtTokenFixture().accessToken,
        accessTokenExpireTime: jwtTokenFixture().accessTokenExpire,
      })
    })
    context('refreshToken이 주어지면', () => {
      it('AccessToken과 AccessTokenExpireTime을 리턴 해야 한다', async () => {
        const tokenResponseDto = await tokenController.createAccessTokenByRefreshTokenHandler(HEADERS)

        expect(tokenResponseDto.accessToken).toEqual(jwtTokenFixture().accessToken)
        expect(tokenResponseDto.accessTokenExpireTime).toBeTruthy()
      })
    })

    context('refreshToken이 주어지고 검증을 실패하면', () => {
      beforeEach(() => {
        tokenIssuer.createAccessTokenByRefreshToken = jest
          .fn()
          .mockRejectedValue(new UnauthorizedException('인증 할 수 없는 token 입니다'))
      })
      it('UnauthorizedException을 던져야 한다', () => {
        expect(tokenController.createAccessTokenByRefreshTokenHandler(HEADERS)).rejects.toThrow(
          new UnauthorizedException('인증 할 수 없는 token 입니다'),
        )
      })
    })

    context('refreshToken이 주어지고 유효기간이 만료가 되면', () => {
      beforeEach(() => {
        tokenIssuer.createAccessTokenByRefreshToken = jest
          .fn()
          .mockRejectedValue(new TokenExpiredException('Refresh Token의 유효기간이 만료되었습니다'))
      })
      it('TokenExpiredException을 던져야 한다', () => {
        expect(tokenController.createAccessTokenByRefreshTokenHandler(HEADERS)).rejects.toThrow(
          new TokenExpiredException('Refresh Token의 유효기간이 만료되었습니다'),
        )
      })
    })

    context('refreshToken이 주어지고 회원 정보를 찾을 수 없으면', () => {
      beforeEach(() => {
        tokenIssuer.createAccessTokenByRefreshToken = jest
          .fn()
          .mockRejectedValue(new MemberNotFoundException('회원 정보를 찾을 수 없습니다'))
      })
      it('MemberNotFoundException을 던져야 한다', () => {
        expect(tokenController.createAccessTokenByRefreshTokenHandler(HEADERS)).rejects.toThrow(
          new MemberNotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })
  })
})
