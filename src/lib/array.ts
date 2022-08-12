export const groupBy = <T>(keyName: string, arr: T[]): Record<string, T[]> => {
	return arr.reduce((res, item) => {
		const key = item[keyName]

		res[key] = res[key] ?? []
		res[key].push(item)
		return res
	}, {})
}
