import { Connection } from 'mysql2/promise'
import { Inject } from '@nestjs/common'
import { MYSQL_CONNECTION } from '../database/constants'

export class DbHelper {
  constructor(
    @Inject(MYSQL_CONNECTION)
    private connection: Connection,
  ) {}

  async clear(table_name: string): Promise<void> {
    await this.connection.execute(`truncate table ${table_name}`)
  }
}
