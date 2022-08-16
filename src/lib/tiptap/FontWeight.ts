import '@tiptap/extension-text-style'
import { Extension } from '@tiptap/core'

export type WeightOptions = {
	types: string[]
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		'font-weight': {
			/**
			 * Set the text color
			 */
			setWeight: (weight: string) => ReturnType
			/**
			 * Unset the text color
			 */
			unsetWeight: () => ReturnType
		}
	}
}

export const FontWeight = Extension.create<WeightOptions>({
	name: 'font-weight',

	addOptions() {
		return {
			types: ['textStyle'],
		}
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					'font-weight': {
						default: null,
						parseHTML: element => element.style.fontWeight?.replace(/['"]+/g, ''),
						renderHTML: attributes => {
							if (!attributes['font-weight']) return {}

							return {
								style: `font-weight: ${attributes['font-weight']}`,
							}
						},
					},
				},
			},
		]
	},

	addCommands() {
		return {
			setWeight:
				weight =>
				({ chain }) => {
					return chain()
						.setMark('textStyle', { ['font-weight']: weight })
						.run()
				},
			unsetWeight:
				() =>
				({ chain }) => {
					return chain()
						.setMark('textStyle', { ['font-weight']: null })
						.removeEmptyTextStyle()
						.run()
				},
		}
	},
})
