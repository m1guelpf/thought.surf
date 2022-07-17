const groupBy = <T>(keyName: string, arr: T[]): Record<string, T[]> => {
	return arr.reduce((res, item) => {
		const key = item[keyName]

		res[key] = res[key] ?? []
		res[key].push(item)
		return res
	}, {})
}

export const groupAndFlatten = <T>(keyName: string, arr: T[]): Array<T | string> => {
	const grouped = groupBy(keyName, arr)

	return Object.entries(grouped)
		.map(([key, value]) => [key, ...value])
		.flat()
}
