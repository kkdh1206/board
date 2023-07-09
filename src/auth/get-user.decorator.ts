import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "./user.entity";

export const GetUser = createParamDecorator((data, ctx:ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user; // 리턴값의 타입이 User 라 위에도 User 적음
})

// createParamDecorator 가 데코레이터를 만드는 함수이고 (아마 매개변수도 가지는)
// switchToHttp().getRequest() http를 사용하는 놈이라면 요청을 판단하고 request객체를 반환 해주는 getRequest()사용
// 추후 그중 .user 를 이용해 user 데이터만 골라냄