import { Item } from './item.entity'
import { itemMock } from '../../../fixture/itemFixture'

describe('Item', () => {
  let items: Item

  describe('객체가 주어지면', () => {
    beforeEach(() => {
      items = new Item(itemMock())
    })

    it('값을 리턴해야 리턴해야 한다', () => {
      expect(items.id).toEqual(1)
      expect(items.modifiedBy).toEqual('수정자')
      expect(items.createBy).toEqual('생성자')
      expect(items.price).toEqual(130000)
      expect(items.itemName).toEqual('New Balance 530 Steel Grey')
      expect(items.itemSellStatus).toEqual('SELL')
      expect(items.stockNumber).toEqual(10)
      expect(items.createTime).toEqual(new Date('2023-09-01T23:10:00.009Z'))
      expect(items.updateTime).toEqual(new Date('2023-09-01T23:10:00.009Z'))
    })
  })

  describe('객체가 빈 값이 주어지면', () => {
    beforeEach(() => {
      items = new Item({})
    })

    it('default 값을 리턴해야 한다', () => {
      expect(items.id).toEqual(0)
      expect(items.modifiedBy).toEqual('')
      expect(items.createBy).toEqual('')
      expect(items.price).toEqual(0)
      expect(items.itemName).toEqual('')
      expect(items.itemSellStatus).toEqual('SELL')
      expect(items.stockNumber).toEqual(0)
    })
  })
})
