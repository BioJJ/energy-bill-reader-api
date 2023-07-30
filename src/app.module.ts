import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnergyBillModule } from './energy-bill/energy-bill.module'

@Module({
	imports: [EnergyBillModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
