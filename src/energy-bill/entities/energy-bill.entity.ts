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

	@Column({ name: 'customer_number' })
	customerNumber: string

	@Column({ name: 'month_reference' })
	monthReference: string

	@Column({ name: 'expiration_date' })
	expirationDate: string

	@Column({ name: 'electricity_kwh' })
	electricityKwh: number

	@Column({ name: 'electricity_unit_price' })
	electricityUnitPrice: number

	@Column({ name: 'electricity_total_price' })
	electricityTotalPrice: number

	@Column({ name: 'injected_energy_kwh' })
	injectedEnergyKwh: number

	@Column({ name: 'injected_energy_unit_price' })
	injectedEnergyUnitPrice: number

	@Column({ name: 'injected_energy_total_price' })
	injectedEnergyTotalPrice: number

	@Column({ name: 'icms_kwh' })
	icmsKwh: number

	@Column({ name: 'icms_unit_price' })
	icmsUnitPrice: number

	@Column({ name: 'icms_total_price' })
	icmsTotalPrice: number

	@Column({ name: 'value_contrib_ilum' })
	valueContribIlum: string

	@Column({ name: 'total_value' })
	totalValue: string

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
