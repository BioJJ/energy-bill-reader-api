import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EnergyBill } from 'src/energy-bill/entities/energy-bill.entity'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('POSTGRES_HOST'),
				port: configService.get('POSTGRES_PORT'),
				username: configService.get('POSTGRES_USER'),
				password: configService.get('POSTGRES_PASSWORD'),
				database: configService.get('POSTGRES_DB'),
				// url: configService.get('DATABASE_URL'),
				entities: [EnergyBill]
				// synchronize: true,
				// logging: true,
				// autoLoadEntities: true,
				// ssl: { rejectUnauthorized: true }
			})
		})
	]
})
export class DatabaseModule {}
