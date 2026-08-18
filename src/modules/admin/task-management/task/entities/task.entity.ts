import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SprintEntity } from 'src/modules/admin/master-data/sprint/entities/sprint.entity';
import { UserEntity } from 'src/modules/admin/system/user/entities/user.entity';

export enum TaskStatus {
  TODO = 'To Do',
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  DUE_DATE = 'Due Date',
}

@Entity({ schema: 'public', name: 'tasks' })
export class TaskEntity {
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

  @Column({ name: 'status', type: 'enum', enum: TaskStatus, nullable: true })
  status?: TaskStatus | null;

  @Column({ name: 'created_by_user_id', type: 'uuid' })
  createdByUserId: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: UserEntity;

  @Column({ name: 'assign_to_user_id', type: 'uuid' })
  assignToUserId: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'assign_to_user_id' })
  assignToUser: UserEntity;

  @Column({ name: 'report_to_user_id', type: 'uuid', nullable: true })
  reportToUserId?: string | null;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'report_to_user_id' })
  reportToUser?: UserEntity | null;

  @Column({ name: 'sprint_id', type: 'uuid' })
  sprintId: string;

  @ManyToOne(() => SprintEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'sprint_id' })
  sprint: SprintEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial?: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }
}
