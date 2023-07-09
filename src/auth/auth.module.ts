import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { TypeOrmExModule } from 'src/configs/typeorm-ex.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStragety } from './jwt.strategy';
import * as config from 'config';

const jwtConfig = config.get('jwt')
@Module({
  imports:[
    PassportModule.register({ defaultStrategy: 'jwt'}), // passport모듈 추가
    JwtModule.register({
      secret: process.env.JWT_SECRERT ||jwtConfig.secret,
      // secret text 설정
      signOptions: {
        expiresIn : jwtConfig.expiresIn
        // token을 유효기간 설정 - 지금은 1시간 (3600초)
      }
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]) // 생성된 UserRepository를 다른곳에서 사용하기위해
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStragety],// 현재 JwtStragety를 Auth 모듈에서 사용하게위해 넣음
  exports:[JwtStragety, PassportModule] // 이건 다른 모듈에서 사용하기위해 넣어줌
})
export class AuthModule {}
