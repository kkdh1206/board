import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './DTO/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { stringify } from 'querystring';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        //@InjectRepository(USerRepository)  내가 만든 custom 은 이거 안씀
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}// 여기가 body부분이라는데 무슨기능일까??

    async signUp(authCredentialDto:AuthCredentialsDto) : Promise<void>{ //signUp 메소드 제작
       return this.userRepository.createUser(authCredentialDto); // 값 아무것도 없는데 왜 return 해줘야할까?? --> 그니까 null값이고 promise도 void로 잡았지
    } // 회원가입때는 반환값있으면 'null 값이 not null 제약조건을 위반' 이 뜬다.

    async signIn(authCredentialDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        const {username, password} = authCredentialDto;
        const user = await this.userRepository.findOne({where: {username}});// findOne 은 Repository 내장함수  --> where: 안쓰려면 findOneBy사용해야함
        // 
        if (user && (await bcrypt.compare(password, user.password))){ // 둘다 만족하면 로그인 성공
            //유저 토큰 생성 ( Secret + Payload 필요)
            const payload ={ username } // 여기에 role이라든가 username등을 넣음 이때 중요한 정보는 넣으면 보안 위험하므로 넣지 않는다.
            const accessToken = await this.jwtService.sign(payload); // access토큰 만듬

            //return 'logIn success'  // compare 는 입력한 password와 실제 user password를 비교해서 같으면 참을 반환하는듯
            return{ accessToken }
        } else {
            throw new UnauthorizedException('logIn failed')
        }
    }
}
