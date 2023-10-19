import { ItemStatusEnum } from '../domain/item-status.enum'
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator'

export class CreateItemRequest {
  @IsNotEmpty({ message: '상품명은 필수 입력 값입니다.' })
  @IsString()
  itemName: string

  @IsNotEmpty({ message: '상품 상세는 필수 입력 값입니다.' })
  @IsString()
  itemDetail: string

  @IsNotEmpty({ message: '가격은 필수 입력 값입니다.' })
  price: number

  @IsNotEmpty({ message: '재고는 필수 입력 값입니다.' })
  stockNumber: number

  @IsEnum({ sellStatus: ItemStatusEnum.SELL })
  sellStatus: ItemStatusEnum
}

export class CreateItemResponse {
  id: number
}
