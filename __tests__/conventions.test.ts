import {
  anchor,
  extractValues,
  createMetadata,
  getMetadata,
  buildCommentBody,
  devider
} from '../src/conventions'
import {expect, test} from '@jest/globals'

test('createMetadata embed a json object into a comment', async () => {
  const comment = createMetadata({bar: 'bar_value'})

  expect(comment).toEqual(`<!--
{
  "bar": "bar_value"
}
-->`)
})

test('getMetadata get a json object from the content', async () => {
  const body = `<!--
{ "bar": "bar_value" }
-->`
  const values = getMetadata(body)

  expect(values['bar']).toEqual('bar_value')
})

test('buildCommentBody builds a body that contains anchor', async () => {
  const body = buildCommentBody('bar', 'bar_value', {})

  expect(body.includes(anchor)).toBeTruthy()
})

test('extractValues can extract values from the built body', async () => {
  const body = buildCommentBody('bar', 'bar_value', {})
  const values = extractValues(body)

  expect(values['bar']).toEqual('bar_value')
})

test('extractValues can extract all values', async () => {
  const body = buildCommentBody('bar', 'bar_value', {foo: 'foo_value'})
  const values = extractValues(body)

  expect(values['bar']).toEqual('bar_value')
  expect(values['foo']).toEqual('foo_value')
})

test('extractValues can ignore metadats above of values', async () => {
  const values = extractValues(`brabrabrba

${anchor}
${devider}
<!-- { "metadata": "this must be ignored" } -->
${devider}
<!-- { "bar": "bar_value"} -->
`)

  expect(values['bar']).toEqual('bar_value')
})
