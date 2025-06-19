import { DataSource } from 'typeorm';
import { UserEntity } from './entities/UserEntity';

export const AppDataSource = new DataSource({
  type: 'postgres', // или mysql2 / sqlite
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
