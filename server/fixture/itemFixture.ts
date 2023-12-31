import { ItemStatusEnum } from '../src/items/domain/item-status.enum'
import { Item } from '../src/items/domain/item.entity'
import { userMock } from './memberFixture'

export const itemMock = (): Item => {
  return {
    id: 1,
    createTime: new Date('2023-09-01T23:10:00.009Z'),
    updateTime: new Date('2023-09-01T23:10:00.009Z'),
    createBy: '생성자',
    modifiedBy: '수정자',
    itemDetail: 'M990WT6',
    itemName: 'New Balance 530 Steel Grey',
    itemSellStatus: ItemStatusEnum.SELL,
    stockNumber: 10,
    price: 130000,
    member: userMock(),
  }
}

export const dbItemMock = {
  item_id: itemMock().id,
  create_time: itemMock().createTime,
  update_time: itemMock().updateTime,
  item_detail: itemMock().itemDetail,
  item_name: itemMock().itemName,
  item_price: itemMock().price,
  item_sell_status: itemMock().itemSellStatus,
  modified_by: itemMock().modifiedBy,
  stock_number: itemMock().stockNumber,
  create_by: itemMock().createBy,
  member_id: userMock().memberId,
}

export const detailItemMock = {
  id: itemMock().id,
  createTime: itemMock().createTime,
  updateTime: itemMock().updateTime,
  itemDetail: itemMock().itemDetail,
  itemName: itemMock().itemName,
  price: itemMock().price,
  itemSellStatus: itemMock().itemSellStatus,
  modifiedBy: itemMock().modifiedBy,
  stockNumber: itemMock().stockNumber,
  createBy: itemMock().createBy,
  member: userMock().memberId,
}
