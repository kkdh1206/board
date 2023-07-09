import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4) // 최소길이 4 이상  이런식으로 유효성에 제한을 두어서 원하는 형식대로 회원가입 하게 함
    @MaxLength(20)
    username : string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]*$/,{ // 영어랑 숫자만 가능한 유효성 체크
        message: 'password only accepts english and number' // 위반시 에러문구가 이렇게 나옴
    })
    password : string;
} // 현재 사용한게 Class-validator 모듈로 Dto파일에 하나하나 유효성 조건 넣어준 것이다.