import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { EnergyBillService } from './energy-bill.service'
import { EnergyBillController } from './energy-bill.controller'

@Module({
	imports: [
		MulterModule.register({
			dest: './uploads'
		})
	],
	providers: [EnergyBillService],
	controllers: [EnergyBillController]
})
export class EnergyBillModule {}
