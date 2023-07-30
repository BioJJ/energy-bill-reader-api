import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import { PDFDocument } from 'pdf-lib'
import * as PDFParse from 'pdf-parse'
import * as path from 'path'

@Injectable()
export class EnergyBillService {
	async parseEnergyInvoice(pdfFilePath: string): Promise<any> {
		const pdfBuffer = await fs.promises.readFile(pdfFilePath)

		const pdfText = await this.extractTextFromPDF(pdfBuffer)
		const relevantInfo = this.extractRelevantInfo(pdfText)

		return relevantInfo
	}

	private async extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
		const { text } = await PDFParse(pdfBuffer)

		return text
	}

	private extractRelevantInfo(text: string): any {
		const numeroClienteRegex = /Nº DO CLIENTE\s+(\d+)/
		const numeroClienteMatch = text.match(numeroClienteRegex)

		const monthRegex = /([A-Z]{3})\/\d{4}/
		const match = text.match(monthRegex)

		let mesReferencia = null

		if (match && match[1]) {
			mesReferencia = match[1]
		}

		const dateRegex = /Vencimento\s+(\d{2}\/\d{2}\/\d{4})/
		const matchDate = text.match(dateRegex)

		let dataVencimento = null
		let quantityEnergy = null
		let unitPriceEnergy = null
		let totalPriceEnergy = null
		let kWh = null
		let precoUnit = null
		let valor = null

		if (matchDate && matchDate[1]) {
			dataVencimento = matchDate[1]
		}

		const regex = /Energia Elétrica kWh (\d+) ([\d.,]+) (\d+,\d{2})/
		const matchEnergy = text.match(regex)

		if (matchEnergy) {
			const [_, quantity, unitPrice, totalPrice] = matchEnergy
			totalPriceEnergy = totalPrice
			quantityEnergy = quantity
			unitPriceEnergy = unitPrice
		}

		const energiaInjetadaPattern =
			/Energia injetada HFP kWh (\d+) ([\d,.-]+) -([\d,.-]+)/

		const matchEnergiaInjetada = text.match(energiaInjetadaPattern)

		if (matchEnergiaInjetada) {
			kWh = matchEnergiaInjetada[1]
			precoUnit = matchEnergiaInjetada[2]
			valor = matchEnergiaInjetada[3]
		}

		const regexIcms = /En comp\. s\/ ICMS kWh (\d+) ([\d.,-]+) ([\d.,-]+)/

		const matchIcms = text.match(regexIcms)

		let kWhIcms = null
		let precoUnitIcms = null
		let valorIcms = null

		if (matchIcms) {
			kWhIcms = matchIcms[1]
			precoUnitIcms = matchIcms[2]
			valorIcms = matchIcms[3]
		}

		const regexContribIlum = /Contrib Ilum Publica Municipal\s*(\d+,\d+)/

		const matchContribIlum = text.match(regexContribIlum)

		let valorContribIlum = null

		if (matchContribIlum) {
			valorContribIlum = matchContribIlum[1].replace(',', '.')
		}

		const regexTotal = /Total a pagar[^\d]*([0-9,.]+)/
		const matchesTotal = text.match(regexTotal)

		let totalValue = null

		if (matchesTotal && matchesTotal.length >= 2) {
			totalValue = matchesTotal[1].replace(',', '.')
		}

		return {
			numeroCliente: numeroClienteMatch ? numeroClienteMatch[1] : '',
			mesReferencia: mesReferencia,
			dataVencimento,
			quantity: parseInt(quantityEnergy),
			unitPrice: parseFloat(unitPriceEnergy.replace(',', '.')),
			totalPrice: parseFloat(totalPriceEnergy.replace(',', '.')),
			kWh,
			precoUnit,
			valor,
			kWhIcms,
			precoUnitIcms,
			valorIcms,
			valorContribIlum,
			totalValue
		}
	}
}
