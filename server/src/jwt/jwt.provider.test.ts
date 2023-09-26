import { Test, TestingModule } from '@nestjs/testing'
import { JwtProvider } from './jwt.provider'
import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { TokenType } from './token-type.enum'
import { userMock } from '../fixture/memberFixture'
import { jwtTokenFixture } from '../fixture/jwtTokenFixture'

describe('JwtProvider class', () => {
  let jwtProvider: JwtProvider

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtProvider],
    }).compile()

    jwtProvider = module.get<JwtProvider>(JwtProvider)
  })

  describe('generateAccessToken method', () => {
    context('사용자 정보가 주어 질 때', () => {
      it('accessToken을 리턴 해야 한다', () => {
        const accessToken = jwtProvider.generateAccessToken(userMock().email, userMock().role)

        expect(accessToken).not.toEqual(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im1lbWJlcklkIjoxLCJlbWFpbCI6ImFiY0BlbWFpbC5jb20iLCJtZW1iZXJOYW1lIjoi7ZmN6ri464-ZIiwibWVtYmVyVHlwZSI6IkdFTkVSQUwiLCJwYXNzd29yZCI6IjEyMzQ1Njc4IiwicmVmcmVzaFRva2VuIjoiZXlKaGJHY2lPaUpJIiwidG9rZW5FeHBpcmF0aW9uVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInJvbGUiOiJVU0VSIiwiY3JlYXRlVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInVwZGF0ZVRpbWUiOiIyMDIzLTA5LTAxVDIzOjEwOjAwLjAwOVoiLCJjcmVhdGVCeSI6Iu2Zjeq4uOuPmSIsIm1vZGlmaWVkQnkiOiLquYDssqDsiJgifSwiaWF0IjoxNjk0MzEzOTIyLCJleHAiOjE2OTQ0MDAzMjJ9.F5gN5mkLFk6nET2pJ78_sTdb_YIStT7u8ei7rfK1I7c',
        )
      })
    })
    context('id가 null이 주어지면', () => {
      it('BadRequestException를 던져야 한다', () => {
        try {
          jwtProvider.generateAccessToken(null, userMock().role)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('id는 null이 될 수 없습니다')
        }
      })
    })
    context('id가 undefined이 주어지면', () => {
      it('BadRequestException를 던져야 한다', () => {
        try {
          jwtProvider.generateAccessToken(undefined, userMock().role)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('id는 undefined이 될 수 없습니다')
        }
      })
    })
  })

  describe('generateRefreshToken method', () => {
    context('사용자 정보가 주어 질 때', () => {
      it('refreshToken을 리턴 해야 한다', () => {
        const refreshToken = jwtProvider.generateRefreshToken(userMock().email)

        expect(refreshToken).not.toEqual(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im1lbWJlcklkIjoxLCJlbWFpbCI6ImFiY0BlbWFpbC5jb20iLCJtZW1iZXJOYW1lIjoi7ZmN6ri464-ZIiwibWVtYmVyVHlwZSI6IkdFTkVSQUwiLCJwYXNzd29yZCI6IjEyMzQ1Njc4IiwicmVmcmVzaFRva2VuIjoiZXlKaGJHY2lPaUpJIiwidG9rZW5FeHBpcmF0aW9uVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInJvbGUiOiJVU0VSIiwiY3JlYXRlVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInVwZGF0ZVRpbWUiOiIyMDIzLTA5LTAxVDIzOjEwOjAwLjAwOVoiLCJjcmVhdGVCeSI6Iu2Zjeq4uOuPmSIsIm1vZGlmaWVkQnkiOiLquYDssqDsiJgifSwiaWF0IjoxNjk0MzEzOTIyLCJleHAiOjE2OTQ0MDAzMjJ9.F5gN5mkLFk6nET2pJ78_sTdb_YIStT7u8ei7rfK1I7c',
        )
      })
    })
    context('id가 null이 주어지면', () => {
      it('BadRequestException를 던져야 한다', () => {
        try {
          jwtProvider.generateRefreshToken(null)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('id는 null이 될 수 없습니다')
        }
      })
    })
    context('id가 undefined이 주어지면', () => {
      it('BadRequestException를 던져야 한다', () => {
        try {
          jwtProvider.generateRefreshToken(undefined)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('id는 undefined이 될 수 없습니다')
        }
      })
    })
  })

  describe('validateToken method', () => {
    context('token 검증 성공하면', () => {
      it('token 정보를 리턴해야 한다.', () => {
        const generateAccessToken = jwtProvider.generateAccessToken(userMock().email, userMock().role)
        const { email, exp, iat, role, sub } = jwtProvider.validateToken(generateAccessToken.accessToken)

        expect(email).toEqual('abc@email.com')
        expect(exp).toBeTruthy()
        expect(iat).toBeTruthy()
        expect(role).toEqual('USER')
        expect(sub).toEqual('ACCESS')
      })
    })

    context('token 검증 실패하면', () => {
      it('UnauthorizedException을 던져야 한다', () => {
        const InValid_Token = (jwtTokenFixture().accessToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQ1MjI0NzUsImV4cCI6MTY5NTczMjA3NSwic3ViIjoiUkVGUkVTSCJ9.A2PfZdj91q6MIapXrvTB6bUd7blhqrrDY2yh0eYdG')
        try {
          jwtProvider.validateToken(InValid_Token)
        } catch (e) {
          expect(e).toBeInstanceOf(UnauthorizedException)
          expect(e.message).toEqual('인증 할 수 없는 token 입니다')
        }
      })
    })

    context('token이 null 이면', () => {
      it('BadRequestException을 던져야 한다', () => {
        try {
          jwtProvider.validateToken(null)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('token는 null이 될 수 없습니다')
        }
      })
    })
    context('token이 undefined 이면', () => {
      it('BadRequestException을 던져야 한다', () => {
        try {
          jwtProvider.validateToken(undefined)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('token는 undefined이 될 수 없습니다')
        }
      })
    })
    context('token이 공백 이면', () => {
      it('BadRequestException을 던져야 한다', () => {
        try {
          jwtProvider.validateToken('')
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('token는 이 될 수 없습니다')
        }
      })
    })
  })

  describe('createAccessTokenExpireTime method', () => {
    context('AccessToken 호출이 되면', () => {
      it('만료시간 1day을 리턴해야 한다', () => {
        const accessTokenExpireTime = jwtProvider.createAccessTokenExpireTime()

        expect(accessTokenExpireTime).toBeTruthy()
      })
    })
  })

  describe('createRefreshTokenExpireTime method', () => {
    context('RefreshToken 호출이 되면', () => {
      it('만료시간 2week를 리턴해야 한다', () => {
        const refreshTokenExpireTime = jwtProvider.createRefreshTokenExpireTime()

        expect(refreshTokenExpireTime).toBeTruthy()
      })
    })
  })

  describe('generateToken method', () => {
    context('id와 accessToken 만료 시간, Access Type이 주어지면', () => {
      it('AccessToken을 리턴해야 한다', () => {
        const payload = {
          email: userMock().email,
        }
        const accessToken = jwtProvider.generateToken(payload, jwtTokenFixture().accessTokenExpire, TokenType.ACCESS)

        expect(accessToken).not.toEqual(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQ2NjY2MTksImV4cCI6MTY5NDY2NzI5Mywic3ViIjoiQUNDRVNTIn0.yrr0muDm32ddItUb3HAAR_bDapXp3t-tKFApU2Wowh8',
        )
      })
    })

    context('id와 refreshToken 만료 시간, Refresh Type이 주어지면', () => {
      it('RefreshToken을 리턴해야 한다', () => {
        const payload = {
          email: userMock().email,
        }
        const refreshToken = jwtProvider.generateToken(payload, jwtTokenFixture().refreshTokenExpire, TokenType.REFRESH)

        expect(refreshToken).not.toEqual(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQ2NjY2NDUsImV4cCI6MTY5NDY2NzQwNywic3ViIjoiUkVGUkVTSCJ9.twLp5ynQZaiAUF9DHNk9Z2xh-GaDeF5QAxk4JA2qW1I',
        )
      })
    })
  })

  describe('createTokenDTO method', () => {
    context('email이 주어지면', () => {
      it('JWT 정보를 리턴해야 한다', () => {
        const tokenDTO = jwtProvider.createTokenDTO(userMock().email, userMock().role)

        expect(tokenDTO).toBeTruthy()
      })
    })
  })

  describe('expiredRefreshToken method', () => {
    context('email과 만료시간이 주어지면', () => {
      it('refreshToken과 refreshToken 만료시간을 리턴해야 한다', () => {
        const expiredRefreshToken = jwtProvider.expiredRefreshToken(userMock().email, new Date())

        expect(expiredRefreshToken.refreshToken).not.toEqual(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiYWJjQGdtYWlsLmNvbSIsImlhdCI6MTY5NTEzNzk5NCwiZXhwIjoxNjk1MTM2MTAzMjYxLCJhdWQiOiJhYmNAZ21haWwuY29tIiwic3ViIjoiUkVGUkVTSCJ9.16pzHwI-EDti2o2MVqnrgQhfVa_tcpVgTJtLdNydoQo',
        )
        expect(expiredRefreshToken.refreshTokenExpireTime).toBeTruthy()
      })
    })

    context('email에 null이 주어지면', () => {
      it('BadRequestException를 던져야 한다', () => {
        try {
          jwtProvider.expiredRefreshToken(null, new Date())
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('email은 null이 될 수 없습니다')
        }
      })
    })

    context('email에 undefined이 주어지면', () => {
      it('BadRequestException를 던져야 한다', () => {
        try {
          jwtProvider.expiredRefreshToken(undefined, new Date())
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('email은 undefined이 될 수 없습니다')
        }
      })
    })

    context('email에 공백이 주어지면', () => {
      it('BadRequestException를 던져야 한다', () => {
        try {
          jwtProvider.expiredRefreshToken('', new Date())
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('email은 이 될 수 없습니다')
        }
      })
    })
  })
})
