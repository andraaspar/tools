export function countMatches(s: string, re: RegExp): number {
	return (s.match(re) || []).length
}
