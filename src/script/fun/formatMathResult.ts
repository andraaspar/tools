import { Decimal } from 'decimal.js'
import Fraction from 'fraction.js'
import { mathDecimal } from '../model/math'
import { decimalToFraction } from './decimalToFraction'
import { fractionToDecimal } from './fractionToDecimal'

export function formatMathResult(
	result: unknown,
	input: string,
	isFraction: boolean,
) {
	if (typeof result === 'string') {
		return result
	} else if (result instanceof Fraction) {
		if (isFraction) {
			return result.toFraction(true)
		} else {
			return mathDecimal.format(fractionToDecimal(result), {
				notation: 'fixed',
			})
		}
	} else if (result instanceof Decimal) {
		if (isFraction) {
			return decimalToFraction(result).toFraction(true)
		} else {
			return mathDecimal.format(result, { notation: 'fixed' })
		}
	} else if (typeof result === 'number') {
		if (isFraction) {
			return new Fraction(result).simplify().toFraction()
		} else {
			return result + ''
		}
	} else {
		return mathDecimal.format(result)
	}
}
