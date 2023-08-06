import { Injectable, NotFoundException } from '@nestjs/common'
import * as fs from 'fs'
import * as PDFParse from 'pdf-parse'
import { EnergyBill } from './entities/energy-bill.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { EnergyBillDto } from './dto/energy-bill.dto'

@Injectable()
export class EnergyBillService {
	constructor(
		@InjectRepository(EnergyBill)
		private readonly energyRepository: Repository<EnergyBill>
	) {}
	async create(createEnergyBillDto: EnergyBillDto): Promise<EnergyBill> {
		const energy = this.energyRepository.create(createEnergyBillDto)

		await this.checkInvoiceNumber(energy.invoiceNumber)

		return await this.energyRepository.save(energy)
	}

	async findAll(): Promise<EnergyBill[]> {
		return await this.energyRepository.find({
			select: [
				'id',
				'invoiceNumber',
				'customerNumber',
				'monthReference',
				'expirationDate',
				'electricityKwh',
				'electricityUnitPrice',
				'electricityTotalPrice',
				'injectedEnergyKwh',
				'injectedEnergyUnitPrice',
				'injectedEnergyTotalPrice',
				'icmsKwh',
				'icmsUnitPrice',
				'icmsTotalPrice',
				'valueContribIlum',
				'totalValue'
			]
		})
	}

	async findOne(id: number): Promise<EnergyBill> {
		const energy = await this.energyRepository.findOneOrFail({
			select: [
				'id',
				'invoiceNumber',
				'customerNumber',
				'monthReference',
				'expirationDate',
				'electricityKwh',
				'electricityUnitPrice',
				'electricityTotalPrice',
				'injectedEnergyKwh',
				'injectedEnergyUnitPrice',
				'injectedEnergyTotalPrice',
				'icmsKwh',
				'icmsUnitPrice',
				'icmsTotalPrice',
				'valueContribIlum',
				'totalValue'
			],
			where: { id }
		})

		if (!id) {
			throw new NotFoundException(`Não achei o Energy Bill com o id ${id}`)
		}
		return energy
	}

	async findOneInvoiceNumber(invoiceNumber: string): Promise<EnergyBill> {
		const energy = await this.energyRepository.findOneOrFail({
			select: [
				'id',
				'invoiceNumber',
				'customerNumber',
				'monthReference',
				'expirationDate',
				'electricityKwh',
				'electricityUnitPrice',
				'electricityTotalPrice',
				'injectedEnergyKwh',
				'injectedEnergyUnitPrice',
				'injectedEnergyTotalPrice',
				'icmsKwh',
				'icmsUnitPrice',
				'icmsTotalPrice',
				'valueContribIlum',
				'totalValue'
			],
			where: { invoiceNumber }
		})

		return energy
	}

	async parseEnergyInvoice(pdfFilePath: string): Promise<EnergyBillDto> {
		const pdfBuffer = await fs.promises.readFile(pdfFilePath)

		const pdfText = await this.extractTextFromPDF(pdfBuffer)
		const relevantInfo = this.extractRelevantInfo(pdfText)

		return relevantInfo
	}

	private async checkInvoiceNumber(invoiceNumber: string): Promise<any> {
		const check = await this.findOneInvoiceNumber(invoiceNumber)
		if (check) {
			throw new NotFoundException(`Nota Fiscal já existente:  ${invoiceNumber}`)
		}
	}

	private async extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
		const { text } = await PDFParse(pdfBuffer)

		return text
	}

	private extractRelevantInfo(text: string): EnergyBillDto {
		return {
			customerNumber: this.rNClient(text),
			invoiceNumber: this.rNInvoice(text),
			monthReference: this.rMonthReference(text),
			expirationDate: this.rExpirationDate(text),

			electricityKwh: parseInt(this.rElectricity(text, 'kwh')),
			electricityUnitPrice: parseFloat(
				this.rElectricity(text, 'unitPrice').replace(',', '.')
			),
			electricityTotalPrice: parseFloat(
				this.rElectricity(text, 'totalPrice').replace(',', '.')
			),

			injectedEnergyKwh: parseInt(this.rInjectedEnergy(text, 'kwh')),
			injectedEnergyUnitPrice: parseFloat(
				this.rInjectedEnergy(text, 'unitPrice').replace(',', '.')
			),
			injectedEnergyTotalPrice: parseFloat(
				this.rInjectedEnergy(text, 'totalPrice').replace(',', '.')
			),
			icmsKwh: parseInt(this.rIcms(text, 'kwh')),
			icmsUnitPrice: parseFloat(
				this.rIcms(text, 'unitPrice').replace(',', '.')
			),
			icmsTotalPrice: parseFloat(
				this.rIcms(text, 'totalPrice').replace(',', '.')
			),
			valueContribIlum: parseFloat(this.rValueContribIlum(text)),
			totalValue: parseFloat(this.rTotalValue(text))
		}
	}

	private rNClient(text: string): string {
		const numberClientRegex = /Nº DO CLIENTE\s+(\d+)/
		const numberClientMatch = text.match(numberClientRegex)

		if (numberClientMatch) {
			return numberClientMatch[1]
		} else {
			return null
		}
	}

	private rNInvoice(text: string): string {
		const regexNotaFiscal = /NOTA FISCAL Nº\s+(\d+)\s+/
		const invoiceNumber = text.match(regexNotaFiscal)[1]

		if (invoiceNumber) {
			return invoiceNumber
		} else {
			return null
		}
	}

	private rMonthReference(text: string) {
		const monthRegex = /([A-Z]{3})\/\d{4}/
		const match = text.match(monthRegex)

		if (match && match[1]) {
			return match[1]
		} else {
			return null
		}
	}

	private rExpirationDate(text: string): string {
		const dateRegex = /Vencimento\s+(\d{2}\/\d{2}\/\d{4})/
		const matchDate = text.match(dateRegex)

		if (matchDate && matchDate[1]) {
			return matchDate[1]
		} else {
			return null
		}
	}

	private rElectricity(text: string, label: string): string {
		const regex = /Energia Elétrica kWh (\d+) ([\d.,]+) (\d+,\d{2})/
		const matchEnergy = text.match(regex)

		if (matchEnergy) {
			const [_, quantity, unitPrice, totalPrice] = matchEnergy
			if (label === 'kwh') return quantity
			if (label === 'unitPrice') return unitPrice
			if (label === 'totalPrice') return totalPrice
		} else {
			return ''
		}
	}

	private rInjectedEnergy(text: string, label: string): string {
		const regex = /Energia injetada HFP kWh (\d+) ([\d,.-]+) -([\d,.-]+)/
		const matchEnergy = text.match(regex)

		if (matchEnergy) {
			const [_, quantity, unitPrice, totalPrice] = matchEnergy
			if (label === 'kwh') return quantity
			if (label === 'unitPrice') return unitPrice
			if (label === 'totalPrice') return totalPrice
		} else {
			return ''
		}
	}

	private rIcms(text: string, label: string): string {
		const regex = /En comp\. s\/ ICMS kWh (\d+) ([\d.,-]+) ([\d.,-]+)/
		const matchEnergy = text.match(regex)

		if (matchEnergy) {
			const [_, quantity, unitPrice, totalPrice] = matchEnergy
			if (label === 'kwh') return quantity
			if (label === 'unitPrice') return unitPrice
			if (label === 'totalPrice') return totalPrice
		} else {
			return ''
		}
	}

	private rValueContribIlum(text: string): string {
		const regexContribIlum = /Contrib Ilum Publica Municipal\s*(\d+,\d+)/

		const matchContribIlum = text.match(regexContribIlum)

		if (matchContribIlum) {
			return matchContribIlum[1].replace(',', '.')
		} else {
			return null
		}
	}

	private rTotalValue(text: string): string {
		const regexTotal = /Total a pagar[^\d]*([0-9,.]+)/
		const matchesTotal = text.match(regexTotal)

		if (matchesTotal && matchesTotal.length >= 2) {
			return matchesTotal[1].replace(',', '.')
		} else {
			return null
		}
	}
}
