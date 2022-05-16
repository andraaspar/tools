export function cursorRange(i: HTMLInputElement): {
	start: number
	end: number
} {
	if (i == null) {
		return { start: 0, end: 0 }
	} else {
		const length = i.value.length
		const start = Math.min(i.selectionStart ?? length, i.selectionEnd ?? length)
		const end = Math.max(i.selectionStart ?? length, i.selectionEnd ?? length)
		return { start, end }
	}
}
