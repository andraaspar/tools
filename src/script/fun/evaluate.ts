import { MathJsStatic } from 'mathjs'

export function evaluate(math: MathJsStatic, s: string, scope: object): string {
	try {
		return math.evaluate(s, scope) ?? ''
	} catch (e) {
		return e + ''
	}
}
