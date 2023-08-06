import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity('energy-bill')
export class EnergyBill {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'invoice_number' })
	invoiceNumber: string

	@Column({ name: 'customer_number' })
	customerNumber: string

	@Column({ name: 'month_reference' })
	monthReference: string

	@Column({ name: 'expiration_date' })
	expirationDate: string

	@Column({ name: 'electricity_kwh', type: 'decimal', precision: 10, scale: 4 })
	electricityKwh: number

	@Column({
		name: 'electricity_unit_price',
		type: 'decimal',
		precision: 8,
		scale: 8
	})
	electricityUnitPrice: number

	@Column({
		name: 'electricity_total_price',
		type: 'decimal',
		precision: 15,
		scale: 4
	})
	electricityTotalPrice: number

	@Column({
		name: 'injected_energy_kwh',
		type: 'decimal',
		precision: 10,
		scale: 4
	})
	injectedEnergyKwh: number

	@Column({
		name: 'injected_energy_unit_price',
		type: 'decimal',
		precision: 8,
		scale: 8
	})
	injectedEnergyUnitPrice: number

	@Column({
		name: 'injected_energy_total_price',
		type: 'decimal',
		precision: 15,
		scale: 4
	})
	injectedEnergyTotalPrice: number

	@Column({ name: 'icms_kwh', type: 'decimal', precision: 10, scale: 4 })
	icmsKwh: number

	@Column({ name: 'icms_unit_price', type: 'decimal', precision: 8, scale: 8 })
	icmsUnitPrice: number

	@Column({
		name: 'icms_total_price',
		type: 'decimal',
		precision: 15,
		scale: 4
	})
	icmsTotalPrice: number

	@Column({
		name: 'value_contrib_ilum',
		type: 'decimal',
		precision: 15,
		scale: 4
	})
	valueContribIlum: number

	@Column({ name: 'total_value', type: 'decimal', precision: 15, scale: 4 })
	totalValue: number

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
}
