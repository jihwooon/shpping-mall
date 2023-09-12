import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
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

  async findByEmail(email: string): Promise<Member> {
    const [[row]] = await this.connection.execute<RowDataPacket[]>(
      'SELECT member_id, member_name, email, member_type, role, refresh_token, token_expiration_time, password, create_time, update_time, create_by, modified_by FROM member WHERE email = ?',
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
    const [rows] = await this.connection.execute<RowDataPacket[]>(
      'SELECT COUNT(email) as emailCount FROM member WHERE email = ?',
      [email],
    )

    const row = rows ?? []

    if (row[0].emailCount >= 1) {
      return true
    }

    return false
  }
}
