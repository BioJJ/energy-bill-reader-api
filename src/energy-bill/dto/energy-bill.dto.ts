import { IsNotEmpty, IsEmail, Matches } from 'class-validator'

export class EnergyBillDto {
	@IsNotEmpty()
	invoiceNumber: string
	@IsNotEmpty()
	customerNumber: string
	@IsNotEmpty()
	monthReference: string
	@IsNotEmpty()
	expirationDate: string
	@IsNotEmpty()
	electricityKwh: number
	@IsNotEmpty()
	electricityUnitPrice: number
	@IsNotEmpty()
	electricityTotalPrice: number
	@IsNotEmpty()
	injectedEnergyKwh: number
	@IsNotEmpty()
	injectedEnergyUnitPrice: number
	@IsNotEmpty()
	injectedEnergyTotalPrice: number
	@IsNotEmpty()
	icmsKwh: number
	@IsNotEmpty()
	icmsUnitPrice: number
	@IsNotEmpty()
	icmsTotalPrice: number
	@IsNotEmpty()
	valueContribIlum: number
	@IsNotEmpty()
	totalValue: number
}
