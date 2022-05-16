import { Decimal } from 'decimal.js'
import Fraction from 'fraction.js'
import { all, create } from 'mathjs'
import { decimalToFraction } from '../fun/decimalToFraction'
import { fractionToDecimal } from '../fun/fractionToDecimal'
import { numberToDecimal } from '../fun/numberToDecimal'
import { numberToFraction } from '../fun/numberToFraction'

const PRECISION = 64
const EPSILON = 0.000000000001

export const mathNumber = create(all, {
	precision: PRECISION,
	epsilon: EPSILON,
})
export const mathDecimal = create(all, {
	number: 'BigNumber',
	precision: PRECISION,
	epsilon: EPSILON,
})
export const mathFraction = create(all, {
	number: 'Fraction',
	precision: PRECISION,
	epsilon: EPSILON,
})
for (const math of [mathNumber, mathDecimal, mathFraction]) {
	const t = math.typed as any
	t.conversions.unshift({
		from: 'Fraction',
		to: 'BigNumber',
		// eslint-disable-next-line
		convert(f: Fraction) {
			return fractionToDecimal(f)
		},
	})
	t.conversions.unshift({
		from: 'BigNumber',
		to: 'Fraction',
		// eslint-disable-next-line
		convert(d: Decimal) {
			return decimalToFraction(d)
		},
	})
	t.conversions.unshift({
		from: 'number',
		to: 'Fraction',
		// eslint-disable-next-line
		convert(n: number) {
			return numberToFraction(n)
		},
	})
	t.conversions.unshift({
		from: 'number',
		to: 'BigNumber',
		// eslint-disable-next-line
		convert(n: number) {
			return numberToDecimal(n)
		},
	})
	// t.conversions.unshift({
	// 	from: 'BigNumber',
	// 	to: 'number',
	// 	// eslint-disable-next-line
	// 	convert(d: Decimal) {
	// 		return decimalToNumber(d)
	// 	},
	// })
	// t.conversions.unshift({
	// 	from: 'Fraction',
	// 	to: 'number',
	// 	// eslint-disable-next-line
	// 	convert(f: Fraction) {
	// 		return fractionToNumber(f)
	// 	},
	// })

	math.import(
		{
			f_join: math.typed!('f_join', {
				'Matrix | Array': function (x: any) {
					return math.flatten!(x).valueOf().join('')
				},
				'...string': function (x: any[]) {
					return x.join('')
				},
			}),
			f_re: math.typed!('f_re', {
				'string, string': function (pattern: string, flags: string) {
					return new RegExp(pattern, flags)
				},
			}),
		},
		{},
	)
}
