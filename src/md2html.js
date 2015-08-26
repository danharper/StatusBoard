import { Parser, HtmlRenderer } from 'commonmark'

const reader = new Parser
const writer = new HtmlRenderer

export default function md2html(md) {
	return writer.render(reader.parse(md))
}
