import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/admin/system/user/entities/user.entity';

export enum ProjectStatus {
  TODO = 'To Do',
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

@Entity({
  schema: 'public',
  name: 'projects',
})
export class ProjectEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    generated: 'uuid',
  })
  id: string;

  @Column({
    name: 'name_en',
    type: 'varchar',
    length: 250,
  })
  nameEn: string;

  @Column({
    name: 'name_kh',
    type: 'varchar',
    length: 250,
  })
  nameKh: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ProjectStatus,
    nullable: true,
  })
  status?: ProjectStatus | null;

  @Column({
    name: 'created_by_user_id',
    type: 'uuid',
  })
  createdByUserId: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial?: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }
}
