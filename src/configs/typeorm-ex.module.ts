import { DynamicModule, Provider } from "@nestjs/common";
import { getDataSourceToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { TYPEORM_EX_CUSTOM_REPOSITORY } from "./typeorm-ex.decorator";

export class TypeOrmExModule {
    public static forCustomRepository<T extends new (...args: any[]) => any>(repositories: T[]): DynamicModule{
        const providers: Provider[] = []; // 걍 provider 배열 선언인듯? 근데 ...은 뭐임?

        for (const repository of repositories){
            const entity = Reflect.getMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, repository);// TYPE~~이게 키, repository가 값인듯
            // Reflect???
        if (!entity) { // 메타데이터 키값에 해당하는 엔티티가 존재하지않으면 continue로 인해 첨으로 돌아감
            continue;
        }

        // Factory providers 를 이용해 동적으로 프로바이더 만들기
        // provide : 프로바이더를 사용할 이름을 정한다.
        // useFactory : 프로바이더가 동작할 방식을 결정한다.

        providers.push ({
            inject: [getDataSourceToken()], // 이건 뭔지 몰겟다
            provide: repository,
            useFactory: (dataSource :DataSource): typeof repository => { // 이거 내용도 공부 요망!
                const baseRepository = dataSource.getRepository<any>(entity);
                return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
              },    
            
        });
    
    
    }

    return {
        exports: providers,
        module: TypeOrmExModule,
        providers,
    };
    }
}

//@CustomRepository 데코레이터가 적용된 Repository를 받아줄 모듈이다.
// Reflect.getMetadat() 메서드로 메타데이터 키값인 TYPEORM_EX_CUSTOM_REPOSITORY에 해당되는 엔티티를 가져온다.
// 메타데이터 키값에 해당하는 엔티티가 존재하면 Factory를 이용해 provider를 동적으로 생성해 providers에 추가한다.