import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import{ v1 as uuid } from 'uuid'; // id는 원래 데이터베이스에 잡아주는데 지금은 로컬 앱만드는거라 모듈 다운받아서 임의 지정해주는 것이다.
import { CreateBoardDto } from './DTO/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { query } from 'express';
// v1은 버전이고 v1이 아니라 이름을 uuid 로 바꾸기위해 as 문법 사용

@Injectable()
export class BoardsService {
    constructor ( // 생성자에서 프로퍼티를 정의할 수 있다.
     // CustomRepository를 생성해 쓰면 @InjectRepository 제거해야한다고 함   
    //  @InjectRepository(Board) // service에서 BoardRepository 를 이용한다고 boardRepository 변수에 넣어줌
        
     
     //  repository 만들필요 없이 걍 바로 import해서 쓰면 될듯 --> 근데 그러면 파일끼리 못묶긴함 
     
        private boardRepository: BoardRepository, // private이라는 접근제한자에 있는 boardRepository는 property로 선언되어 boardService 안에서 사용가능
        // boardRepository라는 프로퍼티에 BoardRepository 타입으로 정의했기 때문에 BoardRepository를 이 service안에서 사용가능
        // private, public으로 프로퍼티 선언도 되고 var를 통해 선언도 됨
        ) {}

        async getAllBoards (): Promise<Board[]>{ // 반환값이 여러개라 배열이기 때문에 Board[]사용
            return this.boardRepository.find(); // Repository 내장 함수인 find메소드는 넣어준 값을 가져오지만 안넣을땐 모든 정보 다 가져옴
        }

        async getMyBoards ( user: User ): Promise<Board[]>{ // 본인의 board만 가져오는 함수
            const query = this.boardRepository.createQueryBuilder('board'); // query builder 생성 board 게시판 table에 접근할것이라 'board'를 넣음
            
            query.where('board.userId = :userId',{ userId: user.id }); // board가 가지고 있는 user id 와 컨트롤러에서 매개변수로 넣어준 현재의 user id 와 동일한놈만 골라줌

            const boards = await query.getMany(); // getMany는 위에서 나온 데이터를 전부다 가져올때 사용
            return boards; // Query Builder를 사용 -- repository api 메소드로 대부분 대체 가능하지만 복잡한건 query builder 사용해야한다
        }
    
    // private boards: Board[] =[]; // private 해두지 않으면 다른곳에서 boards 배열을 수정 가능하다.
    // // Board(타입)를 정의했기 때문에 이를 넣어준다. 
    // // 이때 Board 타입은 id title 과 같은 여러개의 원소를 가지기에 배열로 정의해준다.
    // getAllBoards(): Board[] { // boards 값을 얻을 수 있는 함수
    //     return this.boards;
    // }

    // createBoard(CreateBoardDto: CreateBoardDto){ 
    //     const {title,description } = CreateBoardDto // title 과 description은 바뀔수 있기에 Dto처리한것
    //     const board:Board ={
    //         id : uuid(), // 유니크한 아이디를 만들어줌
    //         title : title,
    //         description, // description: description 과 동일 이것도 된다는것 보여준것
    //         status: BoardStatus.PUBLIC // import 를 하면 board.model.안쓰고 바로 함수 써도 되나?
    //     }// ???

    //     this.boards.push(board); // 만들어둔 게시판 boards에 board를 추가해줌
    //     return board; // 어떤 board가 만들었는지 확인용으로 return함
    // }

    createBoard(createBoardDto: CreateBoardDto, user:User) : Promise<Board> { // DTO의 정보를 받아 board만드는 중
       console.log("??", createBoardDto);// 디버깅한다고 쓴거 코드상 - 의미 없음
      
        // repository를 부르면 자동으로 repository가 실행되며 entity로 save 시키고 우리에게 보여줄 값을 위해 return해준 값을 service에 서 받에서 controller로 return해줌
            // const{title, description} = createBoardDto;
            // console.log(createBoardDto);
            // const board = this.boardRepository.create({ // 객체생성
            //     title,
            //     description,
            //     status: BoardStatus.PUBLIC
            // })
            
            // await this.boardRepository.save(board); // 데이터베이스에 저장하는 save메소드사용
            return this.boardRepository.createBoard(createBoardDto,user); 
        
        // return this.boardRepository.createBoard(createBoardDto); // repository에서 처리해준거 컨트롤러가 request를 위해 요구하면 반환을 위해 남겨둠
        // 서버(entity)에 저장은 repository가 현재 일임하는중
    }



    // getBoardById(id: string): Board { // 특정 게시물을 가져오기 위해 만듬  id로 게시물을 가져오는거임
    //     const found = this.boards.find((board) => board.id === id); // found 라는 놈 만들어서 어떤 id 에 해당하는놈이 없으면 found가 거짓이 됨
    //     if (!found) {
    //         throw new NotFoundException(`Can't find Board with id: ${id}`); // 이런식으로 error 문구 설정 가능
    //     } // `를 쓰고 안에서 ${외부값} 가 작동됨 외부값넣는놈
    //     return found; // find라는 메소드로 맞는 id 에 해당하는 값
    // }   // 근데 :Board 같이 이런 함수에 붙여주는 타입은 이 함수가 반환하는 것의 타입 맞제????????

    

    async getBoardById(id: number): Promise <Board> {// 비동기를 간편하게 처리할 수 있도록 도와주는 객체
        const found = await this.boardRepository.findOneBy({id}); // 이건 오류나서 findOne에서 findOneBy로 바꿈

        if(!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        return found;
    }



    // deleteBoard(id: string) : void{ 
    //     const found = this.getBoardById(id); // getBoardById를 실행시켜 id가 없으면 오류문구 뜨게 함
    //     this.boards = this.boards.filter((board) => board.id !== found.id) // 이 id와 다른것만 남겨 받은 id의 board를 삭제함
    // } // found 를 통해서 실제로 존재하는경우에는 그 게시물의 id를 가져와 filter로 걸러 삭제해버림

    async deleteBoard(id:number, user: User) : Promise<void> {
        const result = await this.boardRepository.delete({id, user :{id:user.id}}); // 오류 따로 해결하긴 했는데 이거 이유 탐구 필요함.. 왜 이렇게 되는지 괄호의 의미 질문해서 알아내기
        console.log('result',result); //result 확인해보게 그냥 넣음
        // 존재하는걸 지우면 이렇게 반환됨 result DeleteResult { raw: [], affected: 1 }
        // 존재 안하면 result DeleteResult { raw: [], affected: 0 } 반환됨 
        // 이를 바탕으로 오류코드 작성
        if (result.affected == 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`)
        } 
    }

    // updateBoardStatus(id:string, status: BoardStatus): Board { // title, description은 Dto로 한번에 수정해서 없는듯
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }

    async updateBoardStatus(id:number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }
}
// 이렇게 모든것에 타입을 붙이는것은 타입스크립트이기 때문인걸까??
// 타입을 안정해도 문제는 없는걸까?
// --> 타입을 정해주는것은 선택사항이다. 하지만 해준다면 원하는 타입이 아닐때 에러가 나서 
// 틀린걸 잡아 낼 수 있고, 가독성이 좋아진다.