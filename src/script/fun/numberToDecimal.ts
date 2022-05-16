import { Decimal } from 'decimal.js'

export function numberToDecimal(n: number): Decimal {
	return new Decimal(n)
}
