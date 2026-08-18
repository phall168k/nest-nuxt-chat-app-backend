import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  VirtualColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/admin/system/user/entities/user.entity';
import { ProjectEntity } from '../../project/entities/project.entity';

export enum SprintStatus {
  TODO = 'To Do',
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  DUE_DATE = 'Due Date',
}

@Entity({ schema: 'public', name: 'sprints' })
export class SprintEntity {
  @PrimaryColumn({ name: 'id', type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 250 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ name: 'status', type: 'enum', enum: SprintStatus, nullable: true })
  status?: SprintStatus | null;

  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT(*) FROM "public"."tasks" WHERE "sprint_id" = ${alias}."id"`,
  })
  taskCount: number;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @ManyToOne(() => ProjectEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @Column({ name: 'created_by_user_id', type: 'uuid' })
  createdByUserId: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial?: Partial<SprintEntity>) {
    Object.assign(this, partial);
  }
}
