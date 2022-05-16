import { Decimal } from 'decimal.js'
import Fraction from 'fraction.js'

export function decimalToFraction(decimal: Decimal): Fraction {
	return new Fraction(decimal.toNumber()).simplify()
}
