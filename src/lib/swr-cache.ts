export const localStorageProvider = (): Map<string, any> => {
	const map = new Map(JSON.parse(getFromLocalStorage('swr-cache', '[]'))) as Map<string, any>

	registerEvent('beforeunload', () => {
		const appCache = JSON.stringify(Array.from(map.entries()))
		localStorage.setItem('app-cache', appCache)
	})

	return map
}

const getFromLocalStorage = (key: string, defaultValue: string) => {
	if (typeof window === 'undefined') return defaultValue

	return localStorage.getItem(key) || defaultValue
}

const registerEvent = (key: string, fn: () => any) => {
	if (typeof window === 'undefined') return

	window.addEventListener(key, fn)
}
