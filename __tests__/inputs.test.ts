import {getInputs} from '../src/inputs'
import * as process from 'process'
import {beforeEach, expect, test} from '@jest/globals'

beforeEach(() => {
  process.env['INPUT_TOKEN'] = 'foo'
  process.env['INPUT_ID'] = 'bar'
  process.env['INPUT_ISSUE-NUMBER'] = '32'
  process.env['INPUT_READ-ONLY'] = 'false' // default in action.yml
  process.env['INPUT_STYLE'] = 'string' // default in action.yml
})

test('rejects negative issue number', async () => {
  process.env['INPUT_ISSUE-NUMBER'] = '-1'

  await expect(getInputs).toThrow('issue-number must be positive: -1')
})

test('rejects zero issue number', async () => {
  process.env['INPUT_ISSUE-NUMBER'] = '0'

  await expect(getInputs).toThrow('issue-number must be positive: 0')
})

test('parse the value with string style', async () => {
  process.env['INPUT_VALUE'] = 'bar_value'
  process.env['INPUT_STYLE'] = 'string'

  const inputs = getInputs()

  expect(inputs.value).toEqual('bar_value')
  // also check other attributes
  expect(inputs.token).toEqual('foo')
  expect(inputs.id).toEqual('bar')
  expect(inputs.issueNumber).toEqual(32)
})

test('parse the value with integer style', async () => {
  process.env['INPUT_VALUE'] = '123'
  process.env['INPUT_STYLE'] = 'integer'

  const inputs = getInputs()

  expect(inputs.value).toEqual(123)
})

test('parse the value with float style', async () => {
  process.env['INPUT_VALUE'] = '12.3'
  process.env['INPUT_STYLE'] = 'float'

  const inputs = getInputs()

  expect(inputs.value).toEqual(12.3)
})

test('parse the value with boolean style', async () => {
  process.env['INPUT_VALUE'] = 'true'
  process.env['INPUT_STYLE'] = 'boolean'

  const inputs = getInputs()

  expect(inputs.value).toEqual(true)
})

test('skip parsing the value if read-only is set', async () => {
  process.env['INPUT_VALUE'] = 'hello'
  process.env['INPUT_READ-ONLY'] = 'true'

  const inputs = getInputs()

  expect(inputs.value).toEqual(undefined)
})
