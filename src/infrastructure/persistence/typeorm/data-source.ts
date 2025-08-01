import { DataSource } from 'typeorm';
import { UserEntity } from './entities/UserEntity';

export const AppPostgreSQLDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_db_user',
  password: 'your_password',
  database: 'test_db',
  synchronize: true,
  logging: false,
  entities: [UserEntity],
  subscribers: [],
  migrations: [],
});

export const AppMySQLDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 5432,
  username: 'your_db_user',
  password: 'your_password',
  database: 'test_db',
  synchronize: true,
  logging: false,
  entities: [UserEntity],
  subscribers: [],
  migrations: [],
});

export const AppSqliteDataSource = new DataSource({
  type: 'sqlite',
  host: 'localhost',
  port: 5400,
  username: 'your_db_user',
  password: 'your_password',
  database: 'test_db',
  synchronize: true,
  logging: false,
  entities: [UserEntity],
  subscribers: [],
  migrations: [],
});
