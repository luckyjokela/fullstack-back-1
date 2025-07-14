import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryColumn('uuid', { name: 'Id', unique: true })
  id!: string;

  @Column({ name: 'Email', unique: true })
  email!: string;

  @Column({ name: 'Password' })
  password!: string;

  @Column({ name: 'Username', unique: true })
  username!: string;

  @Column({ name: 'Name', nullable: true })
  name!: string | null;

  @Column({ name: 'MiddleName', nullable: true })
  middleName!: string | null;

  @Column({ name: 'Surname', nullable: true })
  surname!: string | null;
}
