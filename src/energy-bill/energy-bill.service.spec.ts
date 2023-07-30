import { Test, TestingModule } from '@nestjs/testing'
import { EnergyBillService } from './energy-bill.service'

describe('EnergyBillService', () => {
	let service: EnergyBillService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [EnergyBillService]
		}).compile()

		service = module.get<EnergyBillService>(EnergyBillService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
