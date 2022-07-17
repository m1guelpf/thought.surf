import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const useLocalState = <T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
	const [state, setState] = useState<T>(() => {
		if (typeof window === 'undefined') return initialValue

		return getLocalStorage(key, initialValue)
	})

	useEffect(() => {
		setState(getLocalStorage(key, initialValue))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key])

	const setValue = (value: T) => {
		try {
			value = value instanceof Function ? value(state) : value

			setState(value)

			if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value))
		} catch (error) {
			console.log(error)
		}
	}

	return [state, setValue]
}

const getLocalStorage = <T>(key: string, fallback: T): T => {
	try {
		const item = window.localStorage.getItem(key)

		return item ? JSON.parse(item) : fallback
	} catch (error) {
		console.log(error)

		return fallback
	}
}

export default useLocalState
