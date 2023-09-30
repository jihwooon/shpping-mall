import { ItemImage } from '../item-images/domain/item-image.entity'
import { itemMock } from './itemFixture'

export const itemImageMock = (): ItemImage => {
  return {
    id: 1,
    createTime: new Date('2023-09-01T23:10:00.009Z'),
    updateTime: new Date('2023-09-01T23:10:00.009Z'),
    createBy: '생성자',
    modifiedBy: '수정자',
    imageName: 'Solid Gold Petite Micropave',
    imageUrl: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
    isRepresentImage: false,
    originalImageName: 'Solid Gold Petite Micropave',
    item: itemMock(),
  }
}
