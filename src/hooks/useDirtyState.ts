import { SetStateAction, useState } from 'react'

const useDirtyState = <T>(
	initialState: T
): [T, (state: SetStateAction<T>, { isClean }?: { isClean?: boolean }) => void, boolean] => {
	const [isDirty, setDirty] = useState<boolean>(false)
	const [state, _setState] = useState<T>(initialState)

	const setState = (state: SetStateAction<T>, { isClean }: { isClean?: boolean } = {}) => {
		_setState(state)
		setDirty(isClean ?? true)
	}

	return [state, setState, isDirty]
}

export default useDirtyState
