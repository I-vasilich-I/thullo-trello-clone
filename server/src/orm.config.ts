import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const config: DataSourceOptions = {
  type: 'postgres',
  host: 'postgres',
  port: +(process.env.POSTGRES_PORT as string) as number,
  username: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
  database: process.env.POSTGRES_DB as string,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: true, // do not use it for production, could loose data.
  migrationsTransactionMode: 'each',
};
