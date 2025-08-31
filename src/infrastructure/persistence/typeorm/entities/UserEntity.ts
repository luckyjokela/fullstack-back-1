import { UserRoles } from '../../../../core/entities/variableObjects/Role.enum';
import { Entity, Unique, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Unique(['email', 'username'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'jsonb', default: [] })
  refreshTokens!: Array<{
    token: string;
    expiresAt: number;
    ip: string;
    userAgent: string;
    revoked: boolean;
  }>;

  @Column({ unique: true }) // ✅ email -> email
  email!: string;

  @Column({ unique: true }) // ✅ username -> username
  username!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column()
  middleName!: string;

  @Column()
  surname!: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role!: UserRoles;

  @Column({ default: false })
  isEmailConfirmed!: boolean;

  @Column({ nullable: true })
  confirmationToken?: string;
}
