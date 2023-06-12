import {anchor, extractValues, buildCommentBody} from '../src/conventions'
import {expect, test} from '@jest/globals'

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
  const body = buildCommentBody('bar', 'bar_value', {'foo': 'foo_value'})
  const values = extractValues(body)

  expect(values['bar']).toEqual('bar_value')
  expect(values['foo']).toEqual('foo_value')
})