import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

const dbConfig = config.get('db') // config에서 db 가져옴

export const typeORMConfig : TypeOrmModuleOptions ={
    type: dbConfig.type, // config 파일로 이런 내용은 넣어놓아서 사용
    host: process.env.RDS_HOSTNAME || dbConfig.host, // aws와 같은 데이터베이스에 이미 hostname 이 정의 되있으면 그걸 가져오고 아니면 dbConfig에서 가져옴
    port: process.env.RDS_PORT || dbConfig.port, // RDS_PORT 와 같은 이름은 환경변수 정의시 RDS_PORT라고 주었기 때문에 이렇게 사용된다.
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    entities: [__dirname +`/../**/*.entity.{js,ts}`],
    synchronize: dbConfig.synchronize // develop에서는 true, production에서는 false 로 적용됨   
    // synchronize 가 true 면 실행할때마다 entity를 읽음


    // 그런데 development 인지 default인지는 어떻게 알아내는것인가????????
}