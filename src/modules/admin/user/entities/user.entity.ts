import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    schema: 'public',
    name: 'users',
})
export class UserEntity {
    @PrimaryColumn({
        name: 'id',
        type: 'uuid',
        generated: 'uuid',
    })
    id: string;

    @Column({
        name: 'username',
        type: 'varchar',
        length: '250',
        unique: true,
        nullable: false,
    })
    username: string;

    @Column({
        name: 'full_name',
        type: 'varchar',
        length: '250',
        unique: true,
        nullable: false,
    })
    fullName: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: '260',
        nullable: false,
    })
    password: string;

    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
    })
    isActive: boolean;

    @Column({
        name: 'status',
        type: 'boolean',
        default: false,
    })
    status: boolean;

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
    })
    updatedAt: Date;

    constructor(partial?: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
