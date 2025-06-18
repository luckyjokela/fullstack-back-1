import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}