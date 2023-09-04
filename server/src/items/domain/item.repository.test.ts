import { RowDataPacket, createConnection, Connection } from 'mysql2/promise'
import { DB_RESPONSE } from '../../fixture/itemFixture'
import * as dotenv from 'dotenv'

dotenv.config()

describe('ItemRepository class', () => {
  let connection: Connection

  beforeEach(async () => {
    connection = await createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_ROOT_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: parseInt(process.env.MYSQL_PORT),
    })
  })

  describe('save method', () => {
    beforeEach(async () => {
      await connection.execute(`truncate table item`)
    })

    context('item 객체가 주어지면', () => {
      it('insert 쿼리가 작동해야 한다', async () => {
        await connection.execute(
          `INSERT INTO item (item_id, item_name, item_detail, item_price, item_sell_status, stock_number, create_time) VALUES (1,"New Balance 530 Steel Grey","M990WT6",130000, "SELL", 5, '2023-09-04 07:31:02')`,
        )
      })
    })
  })

  describe('findById method', () => {
    context('id가 주어지면', () => {
      it('select 쿼리가 작동해야 한다', async () => {
        const id = 1
        const [rows] = await connection.execute<RowDataPacket[]>(
          `SELECT item_id, item_name, item_detail, item_price, item_sell_status, stock_number, create_time, update_time, create_by, modified_by FROM item WHERE item_id = ${id}`,
        )
        const [row] = rows ?? []

        expect(row).toEqual(DB_RESPONSE)
      })
    })
  })

  afterAll(async () => {
    await connection.execute(`truncate table item`)
    await connection.end()
  })
})
