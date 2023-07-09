import { Board } from "src/boards/board.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['username']) // 같은 username 사용하면 오류 뜨게됨   --> 이 방법 말고도 findOne 함수로 entity에 존재하는지 확인해서 에러주는 방법도 있다.
export class User extends BaseEntity{
    // unique를 쓰면 이걸 인식을 못하는지 데이터베이스와 연결이 안된다 말한다  --> 원인: 데이터베이스에 unique를 위반하는 값이 이미 있어서 오류 난거임
    

    @PrimaryGeneratedColumn()
    id: number;

    @Column()//{unique:true}
    username: string;
    

    @Column()
    password: string;

    @OneToMany(type => Board, board => board.user, {eager:true}) // 하나의 user에 board 여러게 연결됨
    // 매개변수 3개 필요함 추가되는놈의 타입
    //inverseSide() - board에서 이곳 user 로 접근하려면 어떻게 해야하는지  - 이곳에 접근하려면 어떻게 해야하는지를 정의하는 느낌
    // eager: true 는 유저 정보 가져올때 보드 정보도 같이 가져온다는 뜻
    boards: Board[];// 하나의 유저에 여러개 보드 가능하므로 배열로 정의

    // 이는 board 엔티티의 ManyToOne 과 서로 연결되있는 듯 하다. 
}