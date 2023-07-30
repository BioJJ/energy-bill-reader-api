import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { EnergyBillService } from './energy-bill.service'
import { EnergyBillController } from './energy-bill.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnergyBill } from './entities/energy-bill.entity'

@Module({
	imports: [
		MulterModule.register({
			dest: './uploads'
		}),
		TypeOrmModule.forFeature([EnergyBill])
	],
	providers: [EnergyBillService],
	controllers: [EnergyBillController],
	exports: [EnergyBillService]
})
export class EnergyBillModule {}
