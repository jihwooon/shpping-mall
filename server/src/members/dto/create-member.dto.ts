import { IsNotEmpty, IsString, Matches, Contains, MaxLength } from 'class-validator'

export class CreateMemberDto {
  @IsNotEmpty({ message: '이메일은 필수 입력 값입니다.' })
  @Contains('@', { message: '올바른 이메일 형식을 입력하세요.' })
  @MaxLength(60, { message: '이메일은 60자 이하로 입력해주세요.' })
  @IsString()
  email: string

  @IsNotEmpty({ message: '비밀번호는 필수 입력 값입니다.' })
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,16}$/, { message: '비밀번호는 8자 이상 16이하로 입력해주세요.' })
  @IsString()
  password: string

  @IsNotEmpty({ message: '이름은 필수 입력 값입니다.' })
  @IsString()
  memberName: string
}
