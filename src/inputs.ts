import * as core from '@actions/core'

const MetadataStyle = {
  String: 'string',
  Boolean: 'boolean',
  Integer: 'integer',
  Float: 'float'
} as const

type MetadataStyleValue = (typeof MetadataStyle)[keyof typeof MetadataStyle]

export interface Inputs {
  token: string
  issueNumber: number
  id: string
  value?: unknown
}

const parseValueInput: (name: string, style: string) => unknown = (
  name,
  style
) => {
  if (!Object.values(MetadataStyle).includes(style as MetadataStyleValue)) {
    throw new Error(
      `Invalid style: ${style}. Allowed tyles are ${Object.values(
        MetadataStyle
      )}.`
    )
  }

  switch (style) {
    case MetadataStyle.Integer:
      core.debug(`parsing the value as integer`)
      return parseInt(core.getInput(name, {required: true}))
    case MetadataStyle.Float:
      core.debug(`parsing the value as float`)
      return parseFloat(core.getInput(name, {required: true}))
    case MetadataStyle.Boolean: {
      core.debug(`parsing the value as actions' boolean`)
      return core.getBooleanInput(name, {required: true})
    }
    case MetadataStyle.String: {
      core.debug(`parsing the value as string`)
      return core.getInput(name, {
        required: true,
        trimWhitespace: false
      })
    }
    default: {
      throw new Error('dead code')
    }
  }
}

const getInputs: () => Inputs = () => {
  const token = core.getInput('token', {required: true})
  const issueNumber = parseInt(core.getInput('issue-number', {required: true}))
  const id = core.getInput('id', {required: true})
  const style = core.getInput('style', {required: true})
  const isReadOnly = core.getBooleanInput('read-only', {required: false})

  if (!(issueNumber > 0)) {
    throw new Error(`issue-number must be positive: ${issueNumber}`)
  }

  if (isReadOnly) {
    return {
      token,
      issueNumber,
      id
    }
  } else {
    return {
      token,
      issueNumber,
      id,
      value: parseValueInput('value', style)
    }
  }
}

export {getInputs}
