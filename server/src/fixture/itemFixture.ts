import { ItemStatusEnum } from '../items/domain/item-status.enum'
export const ITEMS = {
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

export const CREATE_REQUEST = {
  id: 1,
  itemName: 'New Balance 530 Steel Grey',
  itemDetail: 'M990WT6',
  price: 130000,
  stockNumber: 10,
  sellStatus: ItemStatusEnum.SELL,
}

export const CREATE_RESPONSE = {
  id: 1,
  itemName: 'New Balance 530 Steel Grey',
  itemDetail: 'M990WT6',
  price: 130000,
  stockNumber: 10,
  sellStatus: ItemStatusEnum.SELL,
}

export const CREATE_NOT_NAME_REQUEST = {
  id: 1,
  itemName: '',
  itemDetail: 'M990WT6',
  price: 130000,
  stockNumber: 10,
  sellStatus: ItemStatusEnum.SELL,
}

export const CREATE_NOT_DETAIL_REQUEST = {
  id: 1,
  itemName: 'New Balance 530 Steel Grey',
  itemDetail: '',
  price: 130000,
  stockNumber: 10,
  sellStatus: ItemStatusEnum.SELL,
}
export const CREATE_NOT_PRICE_REQUEST = {
  id: 1,
  itemName: 'New Balance 530 Steel Grey',
  itemDetail: 'M990WT6',
  stockNumber: 10,
  sellStatus: ItemStatusEnum.SELL,
}

export const CREATE_NOT_STOCK_REQUEST = {
  id: 1,
  itemName: 'New Balance 530 Steel Grey',
  itemDetail: 'M990WT6',
  price: 130000,
  sellStatus: ItemStatusEnum.SELL,
}

export const GET_RESPONSE = {
  id: 1,
  itemName: 'New Balance 530 Steel Grey',
  itemDetail: 'M990WT6',
  price: 130000,
  stockNumber: 10,
  sellStatus: ItemStatusEnum.SELL,
}

export const DB_RESPONSE = {
  create_by: null,
  create_time: new Date('2023-09-04T07:31:02'),
  item_detail: 'M990WT6',
  item_id: 1,
  item_name: 'New Balance 530 Steel Grey',
  item_price: 130000,
  item_sell_status: 'SELL',
  modified_by: null,
  stock_number: 5,
  update_time: null,
}

export const UPDATE_REQUEST = {
  itemName: 'Nike React Infinity Run Flyknit 3 Black White',
  itemDetail: 'DH5392-001',
  price: 95000,
  sellStatus: ItemStatusEnum.SOLD_OUT,
  stockNumber: 10,
}
