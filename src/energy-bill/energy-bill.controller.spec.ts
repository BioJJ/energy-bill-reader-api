import { Test, TestingModule } from '@nestjs/testing'
import { EnergyBillController } from './energy-bill.controller'

describe('EnergyBillController', () => {
	let controller: EnergyBillController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [EnergyBillController]
		}).compile()

		controller = module.get<EnergyBillController>(EnergyBillController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
