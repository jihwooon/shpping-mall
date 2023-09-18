import { Controller, Headers, HttpCode, Post } from '@nestjs/common'
import { TokenIssuer } from '../application/token.issuer'
import { AccessTokenResponseDto } from '../dto/access-token-response.dto'

@Controller('auth')
export class TokenController {
  constructor(private readonly tokenIssuer: TokenIssuer) {}

  @Post('token')
  @HttpCode(201)
  async createAccessTokenByRefreshTokenHandler(@Headers() headers: any): Promise<AccessTokenResponseDto> {
    const refreshToken = headers.authorization.split('Bearer ')[1]

    const accessTokenDto = await this.tokenIssuer.createAccessTokenByRefreshToken(refreshToken, new Date())

    return {
      accessToken: accessTokenDto.accessToken,
      accessTokenExpireTime: accessTokenDto.accessTokenExpireTime,
    }
  }
}
