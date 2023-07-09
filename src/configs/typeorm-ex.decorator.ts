import { SetMetadata } from "@nestjs/common";

// 기존의 @EntityRepository 데코레이터가 삭제되어서 custom 데코레이터를 만든다.

export const TYPEORM_EX_CUSTOM_REPOSITORY = "TYPEORM_EX_CUSTOM_REPOSITORY"; // 근데 이러면 const는 나중에 못 바꾸잖아?? -이건 애초에 데이터가 아니라 데이터 이름인가?

export function CustomRepository(entity: Function): ClassDecorator { // CustomRepository 데코레이터 생성
    return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity); 
} // SetMetadata() 메소드를 이용해 전달받은 entity를 TYPEORM_EX_CUSTOM_REPOSITORY 메타데이터에 지정해준다.

