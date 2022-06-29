import * as dotenv from 'dotenv';
import * as fs from 'fs';
const environment = process.env.NODE_ENV || 'development';
const dataWithMode: any = dotenv.parse(fs.readFileSync(`.env.${environment}`));
const data: any = dotenv.parse(fs.readFileSync('.env'));

const env = {
  ...data,
  ...dataWithMode
}



import { ConnectionOptions } from 'typeorm';
const config: ConnectionOptions  = {
  type: 'mysql',
  host: env.DATABASE_HOST,
  port: parseInt(env.DATABASE_PORT),
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  dropSchema: false,
  synchronize: true,
  migrationsRun: true,
  migrations: ['dist/**/db/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/db/migrations'
  }
}

export default config;