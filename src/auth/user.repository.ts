import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CustomRepository } from "src/configs/typeorm-ex.decorator";
import { AuthCredentialsDto } from "./DTO/auth-credential.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';

@CustomRepository(User) // user를 수정하는 커스텀 repository 라고 인식시켜주는 놈인듯
export class UserRepository extends Repository<User> {
    async createUser(authCredentialDto: AuthCredentialsDto): Promise<void> {
        const { username, password } =authCredentialDto;
    
        const salt = await bcrypt.genSalt(); // 임의의 salt값 만듬
        const hashedPassword = await bcrypt.hash(password, salt); // salt를 이용해 hash처리해 암호화된 비밀번호 생성

        const user = this.create({username, password: hashedPassword}); // password를 저장할때 hash처리된 놈을 보안을 위해 저장
                        // 여기 create 함수는 인자를 entity파일에서 선언한 놈만 받는듯 다른놈 들어오면 오류 생김
        try{
            await this.save(user); // 저장이 될때 오류를 try catch 구문이 잡아줌 - 이를 하지 않으면 Controller 레벨로 가서 오류 internel error 500 오류가 뜬다
        } catch(error) {
            if(error.code == '23505') {
                throw new ConflictException('Existing username'); // console을 통해 구한 에러코드 즉, username 이미 있는경우
            } else{
                throw new InternalServerErrorException(); // 그 외의 경우
            }
            console.log('error', error); // 이거는 터미널에서 찍어서 이 에러 코드 뭔지 알아내려고 넣은거임
        }

        
        //return user; // 원래안하던데 내가 넣음  --> 그럴 필요 없음 void라 안넣는게 맞고 서비스랑 controller도 마찬가지로 값이 안와서 반환값도 null이라 신경안써도될듯
    }
}