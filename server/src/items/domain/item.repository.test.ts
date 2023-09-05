import * as mysql from 'mysql2/promise'
import { DB_RESPONSE } from '../../fixture/itemFixture'

jest.mock('mysql2/promise')

describe('ItemRepository class', () => {
  let connection: mysql.Connection
  const ID = 1

  beforeEach(async () => {
    connection = {
      execute: jest.fn(),
    } as unknown as mysql.Connection
  })

  describe('save method', () => {
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
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[DB_RESPONSE] as mysql.RowDataPacket[], []])
      })
      it('select 쿼리가 작동해야 한다', async () => {
        const [rows] = await connection.execute<mysql.RowDataPacket[]>(
          `SELECT item_id, item_name, item_detail, item_price, item_sell_status, stock_number, create_time, update_time, create_by, modified_by FROM item WHERE item_id = ${ID}`,
        )
        const [row] = rows ?? []

        expect(row).toEqual(DB_RESPONSE)
      })
    })
  })

  describe('update method', () => {
    context('id와 수정 할 item 객체가 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }] as mysql.ResultSetHeader[])
      })
      it('update 쿼리가 작동해야 한다', async () => {
        const [ok] = await connection.execute<mysql.ResultSetHeader>(
          `UPDATE item SET item_name = "Nike React Infinity Run Flyknit 3 Black White", item_detail = "DH5392-001", item_price = 95000, item_sell_status = "SOLD_OUT", stock_number = 10, update_time = '2023-09-05 07:31:02', modified_by = '홍길동' WHERE item_id = ${ID}`,
        )

        expect(ok.affectedRows).toEqual(1)
      })
    })
  })

  afterAll(async () => {
    await connection.end()
  })
})
