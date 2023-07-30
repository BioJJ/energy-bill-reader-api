import {
	BadRequestException,
	Controller,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { EnergyBillService } from './energy-bill.service'

@Controller('energy-bill')
export class EnergyBillController {
	constructor(private readonly energyScraperService: EnergyBillService) {}

	@Post('parse')
	@UseInterceptors(FileInterceptor('pdf'))
	async parseInvoice(
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
}
