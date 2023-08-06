import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { EnergyBillService } from './energy-bill.service'
import { EnergyBill } from './entities/energy-bill.entity'
import { EnergyBillDto } from './dto/energy-bill.dto'

@Controller('energy-bill')
export class EnergyBillController {
	constructor(private readonly energyScraperService: EnergyBillService) {}

	@Post('parse')
	@UseInterceptors(FileInterceptor('pdf'))
	async parseInvoice(
		@UploadedFile() pdfFile: Express.Multer.File
	): Promise<EnergyBill> {
		if (!pdfFile) {
			throw new BadRequestException('No PDF file uploaded.')
		}

		const parsedInvoice = await this.energyScraperService.parseEnergyInvoice(
			pdfFile.path
		)

		if (!parsedInvoice) {
			throw new BadRequestException('No PDF info extract.')
		}

		const energyBill = await this.energyScraperService.create(parsedInvoice)

		return energyBill
	}

	@Post('parse-reader')
	@UseInterceptors(FileInterceptor('pdf'))
	async parseInvoiceReader(
		@UploadedFile() pdfFile: Express.Multer.File
	): Promise<any> {
		if (!pdfFile) {
			throw new BadRequestException('No PDF file uploaded.')
		}

		const parsedInvoice = await this.energyScraperService.parseEnergyInvoice(
			pdfFile.path
		)

		return parsedInvoice
	}

	@Post('parse-create')
	async parseInvoiceCreate(
		@Body() energyBillDto: EnergyBillDto
	): Promise<EnergyBill> {
		return await this.energyScraperService.create(energyBillDto)
	}

	@Get()
	async findAll(): Promise<EnergyBill[]> {
		return await this.energyScraperService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<EnergyBill> {
		return await this.energyScraperService.findOne(+id)
	}
}
