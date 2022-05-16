export function getPass(chars: string): string {
	const charsArr = chars.split('')
	const a = new Uint32Array(16)
	crypto.getRandomValues(a)
	return Array.from(
		a,
		(i) =>
			charsArr[
				Math.floor((i / 0xffffffff) * charsArr.length) % charsArr.length
			],
	).join('')
}
