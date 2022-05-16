import { Decimal } from 'decimal.js'
import Fraction from 'fraction.js'
import { mathDecimal } from '../model/math'

export function fractionToDecimal(f: Fraction): Decimal {
	return mathDecimal.bignumber!(f)
}
