import { DataSource } from 'typeorm';
import { UserEntity } from './entities/UserEntity';

const getDataSourceOptions = () => {
  const mode = process.env.DB_MODE || 'local';

  if (mode === 'supabase') {
    return {
      type: 'postgres' as const,
      host: process.env.DB_HOST_SUPABASE,
      port: parseInt(process.env.DB_PORT_SUPABASE || '5432'),
      username: process.env.DB_USER_SUPABASE,
      password: process.env.DB_PASS_SUPABASE,
      database: process.env.DB_NAME_SUPABASE,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  return {
    type: 'postgres' as const,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  };
};

export const AppPostgreSQLDataSource = new DataSource({
  ...getDataSourceOptions(),
  synchronize: process.env.DB_MODE === 'local',
  logging: false,
  entities: [UserEntity],
  subscribers: [],
  migrations: [],
});

export const AppMySQLDataSource = new DataSource({
  ...getDataSourceOptions(),
  synchronize: process.env.DB_MODE === 'local',
  logging: false,
  entities: [UserEntity],
  subscribers: [],
  migrations: [],
});
