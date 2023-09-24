import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { Test, TestingModule } from '@nestjs/testing'
import { dbItemMock, itemMock } from '../../fixture/itemFixture'
import { ItemRepository } from './item.repository'
import { MYSQL_CONNECTION } from '../../config/database/constants'

describe('ItemRepository class', () => {
  let connection: Connection
  let itemRepository: ItemRepository

  connection = {
    execute: jest.fn(),
  } as unknown as Connection

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemRepository,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    itemRepository = module.get<ItemRepository>(ItemRepository)
  })

  describe('save method', () => {
    context('item 객체가 주어지면', () => {
      it('메서드 호출을 검즘해야 한다.', async () => {
        const spyOn = jest.spyOn(itemRepository, 'save').mockResolvedValue()
        await itemRepository.save(itemMock())

        expect(spyOn).toHaveBeenCalled()
        expect(spyOn).toHaveBeenCalledWith(itemMock())
      })
    })
  })

  describe('findById method', () => {
    context('id가 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[dbItemMock] as RowDataPacket[], []])
      })
      it('item 객체를 리턴해야 한다', async () => {
        const items = await itemRepository.findById(itemMock().id)

        expect(items).toEqual(itemMock())
      })
    })

    context('잘못된 id가 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[undefined] as RowDataPacket[], []])
      })
      it('undefined를 리턴해야 한다', async () => {
        const not_found_id = (itemMock().id = 9999)
        const item = await itemRepository.findById(not_found_id)

        expect(item).toEqual(undefined)
      })
    })
  })

  describe('update method', () => {
    context('id와 수정 할 item 객체가 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }] as ResultSetHeader[])
      })
      it('true를 리턴해야 한다', async () => {
        const items = await itemRepository.update(itemMock().id, itemMock())

        expect(items).toEqual(true)
      })
    })
    context('잘못된 id와 수정 할 item 객체가 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ affectedRows: 0 }] as ResultSetHeader[])
      })
      it('false를 리턴해야 한다', async () => {
        const items = await itemRepository.update(itemMock().id, itemMock())

        expect(items).toEqual(false)
      })
    })
  })
})
