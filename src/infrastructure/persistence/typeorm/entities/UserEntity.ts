import { RefreshTokenWithExpiry } from '../../../../core/entities/variableObjects/RefreshToken';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryColumn('uuid', { name: 'Id', unique: true })
  id!: string;

  @Column({ type: 'jsonb', default: [] })
  refreshTokens!: RefreshTokenWithExpiry[];

  @Column({ name: 'Email', unique: true })
  email!: string;

  @Column({ name: 'Password' })
  password!: string;

  @Column({ name: 'Username', unique: true })
  username!: string;

  @Column({ name: 'Name' })
  name!: string;

  @Column({ name: 'MiddleName' })
  middleName!: string;

  @Column({ name: 'Surname' })
  surname!: string;
}
