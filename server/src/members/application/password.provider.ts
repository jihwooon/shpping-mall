import { BadRequestException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class PasswordProvider {
  async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new BadRequestException(`password는 ${password}이 될 수 없습니다`)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    return hashedPassword
  }

  async comparePassword(rawPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, password)
  }
}
