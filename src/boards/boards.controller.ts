import { Controller, Get, Post, Body, Param, Delete, Patch, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { BoardsService } from './boards.service';
import {  BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './DTO/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { create } from 'domain';

@Controller('boards')
@UseGuards(AuthGuard()) // 로그인되어 올바른 토큰을 주는 놈만 보드를 관리 할 수 있게 해줌
export class BoardsController {
    private logger = new Logger('BoardController') // [BoardController] 로 터미널에 뜨며 어디에서 로그를 내보내는지를 알려주는 역할을 할 수 있게 된다.
    constructor(private boardsService: BoardsService){} // 여기서 타입으로 지정된 BoardsService 는 다른 페이지에서 정의했던 BoardsService 클래스임
    
    // @Get('/') // /boards 경로로 get메소드 http 요청이 들어오는 경우 실행하는 핸들러
    // getAllBoard() : Board[] { // ?? get핸들러의 영향에 있는 함수임?? --> 그런듯?
    //     return this.boardsService.getAllBoards(); // 그래서 boardsService에도 getAllBoards 가 호출이 가능
    // }

    @Get() // boards 뒤에 '/' 또는 암것도 없으면 이게 작동됨 (모든 board 다 나옴)
    getAllBoard(): Promise<Board[]> {
        return this.boardsService.getAllBoards();
    }


    @Get('/myBoards') // boards 뒤에 '/' 또는 암것도 없으면 이게 작동됨 (모든 board 다 나옴)
    getMyBoards(
        @GetUser() user : User, // service 에서 getMyboards 가 작동하도록 매개변수 넣어줌
    ): Promise<Board[]> {
        this.logger.verbose(`User ${user.username} trying to get all boards`) // verbose는 응용프로그램의 동작에 대한 통찰력을 제공하는 정보이다.
        return this.boardsService.getMyBoards(user);
    }

    // @Post() // 게시물 생성기능    --> 아니근데 어디에서 정보를 가져오는지 어케암?? ==> 이 밑에 적은 createBoard 함수가 boardService에 있는 createBoard 가져와란 의민듯 이름바꾸니까 에러뜸
    // @UsePipes(ValidationPipe)// 핸들러레벨에서 하기때문에 @UsePipes 사용 이때, 유효성 검사를 하고싶기에 미리 빌트인 되있는 파이프중 ValidationPipe 사용
    // createBoard( // 클라이언트에서 보낸 정보(이름,description 등등)를 받고 동작을 하는 함수
    //     @Body() CreateBoardDto: CreateBoardDto // 정보를 받는것은 @Body()를 이용함
    // // @Body()는 전체 다받아오고 괄호안에 받고 싶은것만 하나씩 가져 올 수 있다.
    // ) : Board { //받아오는 createBoard가 return하는건 보드 하나기에 []를 안붙임
    //     return this.boardsService.createBoard(CreateBoardDto)
    // }
    // // 위의 Post 코드는 Dto 파일 때문에 좀 바꿔져 있는 상태

    @Post()
    @UsePipes(ValidationPipe) // 기존에 있는 파이프 새로만든건 아님 핸들러수준의 pipe
    CreateBoardDto(@Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User) : Promise<Board> { // 현재 @GetUser 로 user에 user정보 저장됨
    //Promise는 정해진 기간의 기능을 수행 한 후에 정상적으로 기능을 수행했다면 성공의 메세지와 함께 결과 값을 전달해주고 만약 기능을 수행하는 데에 문제가 생기면 에러를 전달 해준다
        this.logger.verbose(`User ${user.username} creating a new board
        Payload: ${JSON.stringify(createBoardDto)}`) // stringify 안해주면 createBoardDto 가 객체라 object라 출력되서 문자열로 바꿔준 것 

        return this.boardsService.createBoard(createBoardDto, user); // 보드만들때 user 정보도 함께 이용
    }




    // //ex) localhost:5000?id=afaffaf   이 상황에서 id를 가져옴
    // @Get('/:id')
    // getBoardById(@Param('id') id:string) :Board { // @Body로는 id 못가져오고 @Param 사용
    //     return this.boardsService.getBoardById(id) // 게시물 1개 return 하므로 Board 타입인듯
    // }



    @Get('/:id') 
    getBoardId(@Param('id') id:number) : Promise<Board> { // 여기 getBoardId도 controller 에서 새로 정의를 한거임
        return this.boardsService.getBoardById(id);
    }


    // //ex) localhost:5000?id=afaffaf&title=wfwfwf 이런식으로 여러개 있는경우
    // //@Param() param: string[] 로 여러개 받기 가능
    // //@Param('id') id:string 으로 하나만 받을 수도 있음
    
    // @Delete('/:id')
    // deleteBoard(@Param('id') id:string): void { // 반환값없어서 void타입
    //     this.boardsService.deleteBoard(id);
    // }

    @Delete('/:id')
    deleteBoard(@Param('id',ParseIntPipe) id, 
    @GetUser() user: User
    ): Promise<void>{ // ParaseIntPipe는 id가 항상 int로 올거기에 그거 확인해주는 역할
        // 여기서 Param이 가져온 값을 id에 지금 여기서 정의와 동시에 넣어주는듯
        return this.boardsService.deleteBoard(id,user);
    }

    // @Patch(':id/status') // Patch와 Param은 어떻게 작동되는것이고 왜 '/id~~'가 아니라 ':/id~'로 넣는것일까?????
    // updateBoardStatus( // 뒤에 id/status(id 랑 status 둘다) 가 오면 status값 받아 수정가능
    //     @Param('id') id:string,
    //     @Body('status',BoardStatusValidationPipe) status:BoardStatus // status만 유효성 검사하기에 파라미터 수준의 pipe 사용
    // ) {
    //     return this.boardsService.updateBoardStatus(id,status) // id에 해당하는 board의 status를 바꿀수 있다.
    // } // board 자체를 return

    @Patch(':id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id:number,
        @Body('status',BoardStatusValidationPipe) status:BoardStatus
        ) {
            return this.boardsService.updateBoardStatus(id,status)
        }
}
