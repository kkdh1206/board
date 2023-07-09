import { BadRequestException, ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../board-status.enum";

export class BoardStatusValidationPipe implements PipeTransform{ // status에 이상한 값주면 에러 보내주는 pipe
    readonly StatusOptions =[
        BoardStatus.PRIVATE,
        BoardStatus.PUBLIC
    ]
    
    
    transform(value: any,){// metadata: ArgumentMetadata) {
        // 요밑에 두줄은 확인용이라 지워진거임
        //console.log('value', value); // 넣어준 status 값(처리가된 인자값)이 value로 옴 현재 좌측의 코드는 콘솔에 value value값 이 뜨게 되는 코드다.
        //console.log('metadata',metadata); // metadata가 저장됨 type과 data등 나타남
        value = value.toUpperCase(); // 어떤 문자가 들어와도 모두 공정하게 대문자처리

        if(!this.isStatusValid(value)) { // isStatusValid에서 True가 반환되오면 False가되고 False가 반환이 되면 True이되어 내부 메소드가 작동한다.
            throw new BadRequestException(`${value} isn't in the status options`)
        }

        return value;
    }

    private isStatusValid(status: any) { // any 타입은 어떤값이든 재 할당이 가능하다.
        const index = this.StatusOptions.indexOf(status); // status 가 StatusOptions 값에 해당하는게 없으면 -1로 index 가 저장된다.  -- 이건 암묵적으로 원래 정해진거임 내가 코드를 따로 친게 아니라 다른 배열에서도 그럼
        return index !== -1 // index==-1 ==> status가 StatusOption값에 없다. False 반환 반대경우는 True 반환
    }
}