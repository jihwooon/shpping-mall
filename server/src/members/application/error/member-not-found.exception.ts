import { NotFoundException } from '@nestjs/common'

export class MemberNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message, {
      cause: 'member',
      description: 'MEMBER_NOT_EXITED',
    })
  }
}
