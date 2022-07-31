class String {
	#value: string

	constructor(value: string = '') {
		this.#value = value
	}

	replaceAll(searchValue: string | RegExp, replaceValue: string): String {
		if (!(searchValue instanceof RegExp)) searchValue = new RegExp(searchValue, 'g')

		this.#value = this.#value.replace(searchValue, replaceValue)

		return this
	}

	toString(): string {
		return this.#value
	}
}

export default String
