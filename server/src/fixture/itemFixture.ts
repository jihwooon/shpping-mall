import { ItemStatusEnum } from '../items/domain/item-status.enum'
import { Item } from '../items/domain/item.entity'

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
}
