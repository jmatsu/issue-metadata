export type Values = {
  [keyof: string]: unknown
}

export const anchor = '<!-- jmatsu/issue-metadata -->'

/** export this value only for testing */
export const devider = '<!-- jmatsu/issue-metadata#devider -->'

export const createMetadata = (content: Values): string => `<!--
${JSON.stringify(content, null, 2)}
-->`

export const getMetadata = (content: string): Values => {
  const start = content.indexOf('<!--') + '<!--'.length
  const end = content.lastIndexOf('-->')

  return JSON.parse(content.substring(start, end))
}

export const extractValues = (body: string): Values => {
  const [, ...fragments] = body.split(devider)

  // The current syntax can store multiple metadata to the single comment.
  const metadatas = fragments.map(f => getMetadata(f))
  // The last metadata must be Values.
  const values = metadatas.pop()

  if (!values) {
    throw new Error('this comment is invalid because the fragment is broken.')
  }

  return values
}

export const buildCommentBody: (
  id: string,
  value: unknown,
  values: Values
) => string = (id, value, values) => {
  values[id] = value

  return `This comment is generated by [jmatsu/issue-metadata](https://github.com/jmatsu/issue-metadata). Do not edit this comment directly.

${anchor}
${devider}
${createMetadata(values)}
`
}
