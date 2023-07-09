import { Repository } from "typeorm";
import { Board } from "./board.entity";
import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { CreateBoardDto } from "./DTO/create-board.dto";
import { BoardStatus } from "./board-status.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { User } from "src/auth/user.entity";

// 데이터 베이스 관련된 일을 처리한다.   typeorm을 import했기에 다양한 메소드를 써볼 수 있다.


@CustomRepository(Board)// 왜 줄쳐져있지?? // 이 클래스가 borad를 repository 해주는 클래스임을 선언

export class BoardRepository extends Repository<Board> { // <>는 제네릭 이다.
//제네릭(Generic)은 클래스 내부에서 지정하는 것이 아닌 외부에서 사용자에 의해 지정되는 것을 의미

    
    // 원래 service 에 있던건데 파일 정리를 위해 repository관련이라 이 파일로 옮김
     async createBoard(createBoardDto : CreateBoardDto, user:User) : Promise<Board>{
         const{title, description} = createBoardDto;
         console.log(createBoardDto);
         const board = this.create({ // 객체생성
             title,
             description,
             status: BoardStatus.PUBLIC,
             user
         })
        
         await this.save(board); // 데이터베이스에 저장하는 save메소드사용 -- 이게 entity 에 이름 맞는곳에 알아서 저장해주는듯
         return board; // service로 갈값
} // 여기로 가져오는게 애초에 repository를 많이 쓰는 구문이라 더 깔끔하네


} // save 함수 정밀 조사 필요


