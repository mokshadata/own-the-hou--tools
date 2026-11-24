import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeExternalLinks from 'rehype-external-links'
import {unified} from 'unified'


export async function getHTMLFromMarkdown(markdownString: string) {
  return await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] })
    .process(markdownString)
}

export const currencyFormatter = new Intl.NumberFormat("en-US",{
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 2,
})

export function formatCurrency(cost: number) {
  return currencyFormatter.format(cost)
}

export function formatPercent(input: number) {
  return percentFormatter.format(input)
}

export function handleWebComponentStyling(node) {
  return () => {

    if (!node) { return }
    const shadowRoot = node.element.shadowRoot;
    let parentStyles = new CSSStyleSheet();
    parentStyles.replaceSync(`
      ${
        [...shadowRoot.ownerDocument.styleSheets]
          .reduce((result, sheet) => (
            [...result, ...[...sheet.cssRules].map((rule) => (rule.cssText))]
          ), [])
          .join('')
      }
    `)

    if (shadowRoot && parentStyles) {
      shadowRoot.adoptedStyleSheets = [
        ...shadowRoot.adoptedStyleSheets,
        parentStyles,
      ]
    }
  }
}