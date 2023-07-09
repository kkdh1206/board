import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './DTO/auth-credential.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService){}// controller에서 service 쓰려면 만들어 줘야함

    @Post('/signup') //?????????? postman으로 값입력해준 body는 여기로 들어오는거 맞제 그럼 DTO로는 언제감? DTO는 저장이 아니라 그냥 하나의 타입(클래스)일 뿐인가??? --> 이거 dto로 바로 저장될걸 postman에서 입력한게
    signUp(@Body(ValidationPipe) authcredentialsDto :AuthCredentialsDto): Promise<void> { //@body 사용 이유는 Post할때 body에서 아이디와 비밀번호를 받기때문
        return this.authService.signUp(authcredentialsDto);//이게 실행되기 전에 ValidationPipe는 요청이 컨트롤러로 왔을때 DTO의 유효성조건을 체크해준다.
    }

    @Post('/signin') // signin 페이지에서 로그인을 위해 아이디 비밀번호를 게시한 경우라고 생각하면 될 듯
    signIn(@Body(ValidationPipe)AuthCredentialsDto: AuthCredentialsDto): Promise <{accessToken: string}> {
        return this.authService.signIn(AuthCredentialsDto);
    }

    @Post('/test') // AuthGuard 를 테스트 하기위해서 만든듯  원래 이 페이지 쪽은 회원가입과 로그인이라 토큰을 확인할 필요가 없는경우가 많다.
    @UseGuards(AuthGuard()) // guard는 nestjs 미들웨어중 하나로 허용된사람과 허용되지 않는 사람을 알려주는 역할을 한다
    test(@GetUser() user: User) {      // 즉, 토큰이 없거나 다르면 Unauthorized를 반환한다. 토큰이 올바른 경우 문제없이 요청이 일어난다
        console.log('user', user); // validate를 만들었을 뿐인데 왜 여기서 user 객체가 반환 되지?
    }
}

//NestJS 데코레이터 요청의 본문에서 필드 데이터를 추출함 추출된 데이터는 컨트롤러 메소드의 파라미터로 전달됨 주로 POST나 PUT같은 HTTP 요청에서 사용됨