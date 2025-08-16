import { UserRoles } from '../../../../core/entities/variableObjects/Role.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'Id' })
  id!: string;

  @Column({ type: 'jsonb', default: [] })
  refreshTokens!: Array<{
    token: string;
    expiresAt: number;
    ip: string;
    userAgent: string;
    revoked: boolean;
  }>;

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

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role!: UserRoles;
}
