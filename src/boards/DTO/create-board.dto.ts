import { IsNotEmpty } from "class-validator";

// 근데 얘는 어떻게 데이터 가져옴?? 데이터베이스에서  --> dto는 유저가 데이터 줄때 받는 방식이다.
// 애초에 그냥 받는놈이었고 데이터베이스에 이를 저장하지않으면 날아감 그래서 save 메소드로 저장해두는거임

export class CreateBoardDto {
    @IsNotEmpty() // 값이 없으면 에러가 나게 해줌. DTO파일이기에 모든 파일에 달아줄 필요없이 여기만 수정해주면 된다.
    title: string;

    @IsNotEmpty() // 이걸 안만들어주면 값이 없어도 그냥 없는 값 그대로 나옴
    description: string;
}