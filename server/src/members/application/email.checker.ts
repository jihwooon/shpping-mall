import { Injectable, BadRequestException } from '@nestjs/common'
import { MemberRepository } from '../domain/member.repository'
import { AlreadyExistedEmailException } from './error/already-existed-email.exception'

@Injectable()
export class EmailChecker {
  constructor(private readonly memberRepository: MemberRepository) {}

  async checkDuplicatedEmail(email: string): Promise<void> {
    const isEmailMatch = await this.memberRepository.existsByEmail(email)
    if (isEmailMatch) {
      throw new AlreadyExistedEmailException('동일한 이메일이 이미 존재합니다')
    }
  }
}
