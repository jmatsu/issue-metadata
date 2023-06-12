import * as core from '@actions/core'
import * as github from '@actions/github'
import {anchor, extractValues, buildCommentBody} from './conventions'
import {getInputs} from './inputs'

async function run(): Promise<void> {
  try {
    const inputs = getInputs()

    core.debug(`inputs: ${JSON.stringify(inputs)})}`)

    const ocktokit = github.getOctokit(inputs.token)

    core.debug(`Fetching comments to search values stored previously`)
    const comments = await ocktokit.paginate(
      'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        ...github.context.repo,
        issue_number: inputs.issueNumber
      }
    )

    const comment = comments.find(c => c.body?.includes(anchor))

    if (comment) {
      if (inputs.value === undefined) {
        core.debug(`Reading comment: ${comment.id}`)

        const values = extractValues(comment.body || '')

        core.setOutput('value', values[inputs.id])
      } else {
        core.info(`Updating comment: ${comment.id}`)

        const values = extractValues(comment.body || '')

        await ocktokit.rest.issues.updateComment({
          ...github.context.repo,
          comment_id: comment.id,
          body: buildCommentBody(inputs.id, inputs.value, values)
        })

        core.setOutput('value', inputs.value)
      }
    } else {
      if (inputs.value === undefined) {
        core.debug(`No comment is available so don't set the output`)
      } else {
        core.info(`Creating comment to store the value`)

        await ocktokit.rest.issues.createComment({
          ...github.context.repo,
          issue_number: inputs.issueNumber,
          body: buildCommentBody(inputs.id, inputs.value, {})
        })

        core.setOutput('value', inputs.value)
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
