import type { LinkOptions } from '@tiptap/extension-link'
import { Link as TiptapLink } from '@tiptap/extension-link'
import { InputRule, markInputRule, markPasteRule, PasteRule } from '@tiptap/react'

/**
 * The input regex for Markdown links with title support, and multiple quotation marks (required
 * in case the `Typography` extension is being included).
 *
 * @see https://stephenweiss.dev/regex-markdown-link
 */
const inputRegex = /(?:^|\s)\[([^\]]*)?\]\(([A-Za-z0-9:/. ]+)(?:["“](.+)["”])?\)$/

/**
 * The paste regex for Markdown links with title support, and multiple quotation marks (required
 * in case the `Typography` extension is being included).
 *
 * @see https://stephenweiss.dev/regex-markdown-link
 */
const pasteRegex = /(?:^|\s)\[([^\]]*)?\]\(([A-Za-z0-9:/. ]+)(?:["“](.+)["”])?\)/g

/**
 * Input rule built specifically for the `Link` extension, which ignores the auto-linked URL in
 * parentheses (e.g., `(https://doist.dev)`).
 *
 * @see https://github.com/ueberdosis/tiptap/discussions/1865
 */
function linkInputRule(config: Parameters<typeof markInputRule>[0]) {
	const defaultMarkInputRule = markInputRule(config)

	return new InputRule({
		find: config.find,
		handler: props => {
			const { tr } = props.state

			defaultMarkInputRule.handler(props)
			tr.setMeta('preventAutolink', true)
		},
	})
}

/**
 * Paste rule built specifically for the `Link` extension, which ignores the auto-linked URL in
 * parentheses (e.g., `(https://doist.dev)`).
 *
 * @see https://github.com/ueberdosis/tiptap/discussions/1865
 */
function linkPasteRule(config: Parameters<typeof markPasteRule>[0]) {
	const defaultMarkInputRule = markPasteRule(config)

	return new PasteRule({
		find: config.find,
		handler: props => {
			const { tr } = props.state

			defaultMarkInputRule.handler(props)
			tr.setMeta('preventAutolink', true)
		},
	})
}

/**
 * Custom extension that extends the built-in `Link` extension to add additional input and paste
 * rules for converting the Markdown link syntax [Doist](https://doist.com) into links. This
 * extension also adds support for the `title` attribute.
 */
const Link = TiptapLink.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			title: {
				default: null,
			},
		}
	},
	addInputRules() {
		return [
			linkInputRule({
				find: inputRegex,
				type: this.type,

				// We need to use `pop()` to remove the last capture groups from the match to
				// satisfy Tiptap's `markPasteRule` expectation of having the content as the last
				// capture group in the match (this makes the attribute order important)
				getAttributes(match) {
					return {
						title: match.pop()?.trim(),
						href: match.pop()?.trim(),
					}
				},
			}),
		]
	},
	addPasteRules() {
		return [
			linkPasteRule({
				find: pasteRegex,
				type: this.type,

				// We need to use `pop()` to remove the last capture groups from the match to
				// satisfy Tiptap's `markInputRule` expectation of having the content as the last
				// capture group in the match (this makes the attribute order important)
				getAttributes(match) {
					return {
						title: match.pop()?.trim(),
						href: match.pop()?.trim(),
					}
				},
			}),
		]
	},
})

export { Link }

export type { LinkOptions }