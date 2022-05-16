import Fraction from 'fraction.js'

export function numberToFraction(n: number): Fraction {
	return new Fraction(n)
}
