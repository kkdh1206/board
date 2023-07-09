import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BoardStatus } from "./board-status.enum";
import { User } from "src/auth/user.entity";




@Entity() // Entity인걸 인식하게 해줌
export class Board extends BaseEntity{ // board table 자동적으로 생성
    @PrimaryGeneratedColumn() // board entity의 기본키임을 알려주기 위해 사용 
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: BoardStatus;
    
    @ManyToOne(type => User, user=> user.boards, {eager: false}) // eager:false 면 board 정보를 가져올때 user정보는 가져오지않는다.
    user: User; // board.user가 이걸 지칭함
    // user entity에서도 정의를 하며 서로를 정의하는 방식이다.
}// 근데 왜 보드 정보에 유저정보는 왜 출력이 안될까?

// entity은 table로 변환이 된다.
// repository 는 이를 삭제하거나 수정 삽입 업데이트 찾기 등을 할 수 있다.
// repository 는 작업을 해 데이터를 서비스로 보내주면 그거가지고 작업해 client에게 response를 해준다. 