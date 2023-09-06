import { Injectable, BadRequestException } from '@nestjs/common'
import { MemberRepository } from '../domain/member.repository'

@Injectable()
export class EmailChecker {
  constructor(private readonly memberRepository: MemberRepository) {}

  async checkDuplicatedEmail(email: string): Promise<void> {
    const isEmailMatch = await this.memberRepository.existsByEmail(email)
    if (isEmailMatch) {
      throw new BadRequestException('동일한 이메일이 이미 존재합니다.', {
        cause: new Error(),
        description: 'Bad Request',
      })
    }
  }
}
