import { DataSource } from 'typeorm';
import { UserEntity } from './entities/UserEntity';

export const AppPostgreSQLDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  logging: false,
  entities: [UserEntity],
  subscribers: [],
  migrations: [],
});
