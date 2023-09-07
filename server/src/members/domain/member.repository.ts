import { Connection, RowDataPacket, ResultSetHeader } from 'mysql2/promise'
import { Inject } from '@nestjs/common'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Member } from './member.entity'

export class MemberRepository {
  constructor(
    @Inject(MYSQL_CONNECTION)
    private connection: Connection,
  ) {}

  async save(member: Member): Promise<number | undefined> {
    const [{ insertId }] = await this.connection.execute<ResultSetHeader>(
      'INSERT INTO member (member_id, member_name, email, member_type, role, refresh_token, token_expiration_time, password, create_time, update_time, create_by, modified_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        member.memberId,
        member.memberName,
        member.email,
        member.memberType,
        member.role,
        member.refreshToken,
        member.tokenExpirationTime,
        member.password,
        member.createTime,
        member.updateTime,
        member.createBy,
        member.modifiedBy,
      ],
    )

    if (insertId === 0) {
      return undefined
    }

    return insertId
  }

  async findByEmail(email: string): Promise<Pick<Member, 'email'> | undefined> {
    const [[row]] = await this.connection.execute<RowDataPacket[]>('SELECT email FROM member WHERE email = ?', [email])

    if (!row) {
      return undefined
    }

    return {
      email: row['email'],
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    const [rows] = await this.connection.execute<RowDataPacket[]>('SELECT COUNT(email) FROM member WHERE email = ?', [
      email,
    ])

    const row = rows ?? []

    if (row[0].email >= 1) {
      return true
    }

    return false
  }
}