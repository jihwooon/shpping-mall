import { Connection, RowDataPacket, ResultSetHeader } from 'mysql2/promise'
import { Inject } from '@nestjs/common'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Member } from './member.entity'

export class MemberRepository {
  constructor(
    @Inject(MYSQL_CONNECTION)
    private connection: Connection,
  ) {}

  async findByEmail(email: string): Promise<Member | undefined> {
    const [[row]] = await this.connection.execute<RowDataPacket[]>(
      'SELECT member_id, email, member_name, member_type, paswword, refresh_token, token_expiration_time, role, create_time,update_time, create_by, modified_by FROM member WHERE email = ?',
      [email],
    )

    if (!row) {
      return undefined
    }

    return {
      memberId: row['member_id'],
      email: row['email'],
      memberName: row['member_name'],
      memberType: row['member_type'],
      password: row['password'],
      refreshToken: row['refresh_token'],
      tokenExpirationTime: row['token_expiration_time'],
      role: row['role'],
      createTime: row['create_time'],
      updateTime: row['update_time'],
      createBy: row['create_by'],
      modifiedBy: row['modified_by'],
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    const [{ fieldCount }] = await this.connection.execute<ResultSetHeader>(
      'SELECT COUNT(email) FROM member WHERE email = ?',
      [email],
    )

    if (fieldCount >= 1) {
      return false
    }

    return true
  }
}
