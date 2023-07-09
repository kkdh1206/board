import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { TypeOrmExModule } from 'src/configs/typeorm-ex.module';
import { Board } from './board.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    // TypeOrmModule.forFeature([Board]), // 원빈 선배 말대로 바로 repository 씀
    // TypeOrmModule.forFeature([BoardRepository]), // 여기서 forFeature는 뭘까? 그리고 왜 이걸하는걸까?
    TypeOrmExModule.forCustomRepository([BoardRepository]), // @EntityRepository 가 안되서 직접 custom한 데코레이터
    AuthModule
  ], // forFeature 은 이 모듈안에 괄호안것을 등록해줘서 다른곳에서도 쓸 수 있게 해준다.
  controllers: [BoardsController],
  providers: [BoardsService,]
})
export class BoardsModule {}
