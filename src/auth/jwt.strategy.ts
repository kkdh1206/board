import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import * as config from 'config';

 // 다른데서도 이 JwtStragety 클래스 주입가능하게만듬
 //@Injectable() 대신 CustomRepository가 들어감 @InjectRepository가 아니라
@CustomRepository(UserRepository)
export class JwtStragety extends PassportStrategy(Strategy){ // Stragety는 jwt-stargety를 사용하기 위해 넣어준 것 import되는 곳이 jwt다 
    constructor(
        private userRepository: UserRepository
    ){
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'), // 리퀘스트와 함께온 토큰 확인용
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken() // bear
            // 토큰은 bearertoken 으로 온다 그래서 bearerToken에서 토큰을 받아오는거임
        })
    }
    async validate(payload) {  //  비동기 메소드 선언
        console.log("??");
        const { username } = payload; // payload에서 username 가져옴
        const user: User = await this.userRepository.findOneBy({username}); // username에 맞는 유저 정보가 있는지 보는것 

        if(!user) {
            throw new UnauthorizedException(); // 오류 메세지 출력 ( user 객체 값이 없으면 null 출력함 이 경우 오류메세지 출력)
        }
        return user; // username 과 같은 user 객체 반환
    }



    
}