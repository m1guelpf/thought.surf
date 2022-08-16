import { JSONContent } from '@tiptap/react'

export const buildDoc = (content: JSONContent[]): JSONContent => ({ type: 'doc', content })
export const buildText = (text: string, attrs?: Record<string, string>): JSONContent => ({
	type: 'text',
	marks: attrs ? [buildTextStyle(attrs)] : undefined,
	text,
})
export const buildHeading = (text: string | Array<JSONContent | string>, level: number): JSONContent => ({
	type: 'heading',
	attrs: { level },
	content: buildContent(text),
})
export const buildParagraph = (text: string | Array<JSONContent | string>): JSONContent => ({
	type: 'paragraph',
	content: buildContent(text),
})
export const buildTaskList = (content: JSONContent[]): JSONContent => ({ type: 'taskList', content })
export const buildTaskItem = (text: string | Array<JSONContent | string>, checked: boolean): JSONContent => ({
	type: 'taskItem',
	attrs: { checked },
	content: buildContent(text, buildParagraph),
})

const buildTextStyle = (
	attrs: Record<string, string>
): {
	type: string
	attrs?: Record<string, string>
} => ({ type: 'textStyle', attrs })

const buildContent = (
	text: string | Array<JSONContent | string>,
	onEmpty: (string) => JSONContent = buildText
): JSONContent[] =>
	Array.isArray(text) ? text.map(text => (typeof text === 'string' ? onEmpty(text) : text)) : [onEmpty(text)]
