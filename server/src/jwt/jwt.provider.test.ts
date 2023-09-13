import { Test, TestingModule } from '@nestjs/testing'
import { JwtProvider } from './jwt.provider'
import { BadRequestException, UnauthorizedException } from '@nestjs/common'

describe('JwtProvider class', () => {
  let jwtProvider: JwtProvider

  let INVALID_ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im1lbWJlcklkIjoxLCJlbWFpbCI6ImFiY0BlbWFpbC5jb20iLCJtZW1iZXJOYW1lIjoi7ZmN6ri464-ZIiwibWVtYmVyVHlwZSI6IkdFTkVSQUwiLCJwYXNzd29yZCI6IjEyMzQ1Njc4IiwicmVmcmVzaFRva2VuIjoiZXlKaGJHY2lPaUpJIiwidG9rZW5FeHBpcmF0aW9uVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInJvbGUiOiJVU0VSIiwiY3JlYXRlVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInVwZGF0ZVRpbWUiOiIyMDIzLTA5LTAxVDIzOjEwOjAwLjAwOVoiLCJjcmVhdGVCeSI6Iu2Zjeq4uOuPmSIsIm1vZGlmaWVkQnkiOiLquYDssqDsiJgifSwiaWF0IjoxNjk0MzEzOTIyLCJleHAiOjE2OTQ0MDAzMjJ9.F5gN5mkLFk6nET2pJ78_sTdb_YIStT7u8ei7rfK1I123'
  const Id = 1
  const ACCESS_TOKEN_EXPIRE = new Date(Date.now() + 86400000)
  const REFRESH_TOKEN_EXPIRE = new Date(Date.now() + 1210500000)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtProvider],
    }).compile()

    jwtProvider = module.get<JwtProvider>(JwtProvider)
  })

  describe('generateAccessToken method', () => {
    context('사용자 정보가 주어 질 때', () => {
      it('accessToken을 리턴 해야 한다', () => {
        const accessToken = jwtProvider.generateAccessToken(Id, ACCESS_TOKEN_EXPIRE)

        expect(accessToken).not.toEqual(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im1lbWJlcklkIjoxLCJlbWFpbCI6ImFiY0BlbWFpbC5jb20iLCJtZW1iZXJOYW1lIjoi7ZmN6ri464-ZIiwibWVtYmVyVHlwZSI6IkdFTkVSQUwiLCJwYXNzd29yZCI6IjEyMzQ1Njc4IiwicmVmcmVzaFRva2VuIjoiZXlKaGJHY2lPaUpJIiwidG9rZW5FeHBpcmF0aW9uVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInJvbGUiOiJVU0VSIiwiY3JlYXRlVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInVwZGF0ZVRpbWUiOiIyMDIzLTA5LTAxVDIzOjEwOjAwLjAwOVoiLCJjcmVhdGVCeSI6Iu2Zjeq4uOuPmSIsIm1vZGlmaWVkQnkiOiLquYDssqDsiJgifSwiaWF0IjoxNjk0MzEzOTIyLCJleHAiOjE2OTQ0MDAzMjJ9.F5gN5mkLFk6nET2pJ78_sTdb_YIStT7u8ei7rfK1I7c',
        )
      })
    })
    context('id가 null이 주어지면', () => {
      it('BadRequestException를 던져야 한다', () => {
        try {
          jwtProvider.generateAccessToken(null, ACCESS_TOKEN_EXPIRE)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('id는 null이 될 수 없습니다')
        }
      })
    })
    context('id가 undefined이 주어지면', () => {
      it('BadRequestException를 던져야 한다', () => {
        try {
          jwtProvider.generateAccessToken(undefined, ACCESS_TOKEN_EXPIRE)
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
        const refreshToken = jwtProvider.generateRefreshToken(Id, REFRESH_TOKEN_EXPIRE)

        expect(refreshToken).not.toEqual(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im1lbWJlcklkIjoxLCJlbWFpbCI6ImFiY0BlbWFpbC5jb20iLCJtZW1iZXJOYW1lIjoi7ZmN6ri464-ZIiwibWVtYmVyVHlwZSI6IkdFTkVSQUwiLCJwYXNzd29yZCI6IjEyMzQ1Njc4IiwicmVmcmVzaFRva2VuIjoiZXlKaGJHY2lPaUpJIiwidG9rZW5FeHBpcmF0aW9uVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInJvbGUiOiJVU0VSIiwiY3JlYXRlVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInVwZGF0ZVRpbWUiOiIyMDIzLTA5LTAxVDIzOjEwOjAwLjAwOVoiLCJjcmVhdGVCeSI6Iu2Zjeq4uOuPmSIsIm1vZGlmaWVkQnkiOiLquYDssqDsiJgifSwiaWF0IjoxNjk0MzEzOTIyLCJleHAiOjE2OTQ0MDAzMjJ9.F5gN5mkLFk6nET2pJ78_sTdb_YIStT7u8ei7rfK1I7c',
        )
      })
    })
    context('id가 null이 주어지면', () => {
      it('BadRequestException를 던져야 한다', () => {
        try {
          jwtProvider.generateRefreshToken(null, REFRESH_TOKEN_EXPIRE)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('id는 null이 될 수 없습니다')
        }
      })
    })
    context('id가 undefined이 주어지면', () => {
      it('BadRequestException를 던져야 한다', () => {
        try {
          jwtProvider.generateRefreshToken(undefined, REFRESH_TOKEN_EXPIRE)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('id는 undefined이 될 수 없습니다')
        }
      })
    })
  })

  describe('validateToken method', () => {
    context('accessToken이 검증을 성공하면', () => {
      it('id를 리턴 해야 한다.', () => {
        const payload = jwtProvider.validateToken(jwtProvider.generateAccessToken(Id, ACCESS_TOKEN_EXPIRE))

        expect(payload).toEqual(1)
      })
    })
    context('accessToken이 검증을 실패하면', () => {
      it('UnauthorizedException을 던져야 한다', () => {
        try {
          jwtProvider.validateToken(INVALID_ACCESS_TOKEN)
        } catch (e) {
          expect(e).toBeInstanceOf(UnauthorizedException)
          expect(e.message).toEqual('인증 할 수 없는 token 입니다')
        }
      })
    })
    context('accessToken이 null 이면', () => {
      it('BadRequestException을 던져야 한다', () => {
        try {
          jwtProvider.validateToken(null)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('token는 null이 될 수 없습니다')
        }
      })
    })
    context('accessToken이 undefined 이면', () => {
      it('BadRequestException을 던져야 한다', () => {
        try {
          jwtProvider.validateToken(undefined)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('token는 undefined이 될 수 없습니다')
        }
      })
    })
    context('accessToken이 공백 이면', () => {
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
})
