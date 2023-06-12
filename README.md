<p align="center">
  <a href="https://github.com/jmatsu/issue-metadata/actions"><img alt="typescript-action status" src="https://github.com/jmatsu/issue-metadata/workflows/build-test/badge.svg"></a>
</p>

# Preserve metadatas on issues/PRs

This action uses an issue comment to save/read values for each issue/pull-request.

## Put a new value

```yaml
    steps:
      - id: write-value
        uses: jmatsu/issue-metadata@v1
        with:
          id: "<value id to write>"
          value: "<value itself>"
          issue-number: ${{ github.event.pull_request.number }}
      - run: echo "${{ steps.write-value.outputs.value }}"
```

**You can save values as json primitives**

```yaml
    steps:
      - id: write-value
        uses: jmatsu/issue-metadata@v1
        with:
          id: "<value id to write>"
          value: "<value itself>"
          # e.g. string(default), integer, float, boolean
          style: integer # save and read a value as Integer. i.e. 1.0 will be saved as 1.
          issue-number: ${{ github.event.pull_request.number }}
```

If you would like to save a JSON object, you need to save the value as string and parse it in later steps.

```yaml
    steps:
      - id: write-value
        uses: jmatsu/issue-metadata@v1
        with:
          id: 'test'
          value: '{ "name1": "value1" }'
          style: string
          issue-number: ${{ github.event.pull_request.number }}
      - if: ${{ fromJSON(steps.write-value.outputs.value).name == 'name1' }}
        run: echo ${{ fromJSON(steps.write-value.outputs.value) }} # => { "name1": "value1" }
```


## Read a value

```yaml
    steps:
      - id: read-value
        uses: jmatsu/issue-metadata@v1
        with:
          id: "<value id to read>"
          read-only: true # required if you don't want to write any value
          issue-number: ${{ github.event.pull_request.number }}
      - run: echo "${{ steps.read-value.outputs.value }}"
```

**You can read a value as json primitive**

```yaml
    steps:
      - id: read-value
        uses: jmatsu/issue-metadata@v1
        with:
          id: "foo"
          # e.g. string(default), integer, float, boolean
          style: integer
          issue-number: ${{ github.event.pull_request.number }}
        # steps.read-value.outputs.value == 1 even if *foo*'s value is 1.1
```

# Development

- Make sure all tests are passed by running `npm run test`.
- You don't have to commit the changed artifact under `dist/`.
  - All changes under `dists/` will be rejected because of the security reason.

# Release

This section is only for those who have write-permission of this repository.

```bash
$ npm run all
$ git add dist # and commit
$ git push origin releases/v1
$ git tag v1.x.y
$ git push v1.x.y:v1 -f
```

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
