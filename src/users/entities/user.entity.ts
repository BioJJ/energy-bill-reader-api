import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	BeforeInsert
} from 'typeorm'
import { hashSync } from 'bcrypt'

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column()
	email: string

	@Column()
	password: string

	@Column()
	phone: string

	@Column({ name: 'date_of_birth' })
	dateBirth: string

	@Column({ default: true })
	status: boolean

	@CreateDateColumn({
		type: 'timestamp',
		name: 'create_at',
		default: () => 'CURRENT_TIMESTAMP(6)'
	})
	createAt: Date

	@UpdateDateColumn({
		type: 'timestamp',
		name: 'update_at',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)'
	})
	updateAt: Date

	@DeleteDateColumn({
		type: 'timestamp',
		name: 'deleted_at'
	})
	deletedAt: Date

	@BeforeInsert()
	hashPassword() {
		this.password = hashSync(this.password, 10)
	}
}
