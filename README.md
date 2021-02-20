@dops/cli
=========

build and deployment tools

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@dops/cli.svg)](https://npmjs.org/package/@dops/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@dops/cli.svg)](https://npmjs.org/package/@dops/cli)
[![License](https://img.shields.io/npm/l/@dops/cli.svg)](https://github.com/connceptualpathways/dops/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @doptools/cli
$ dops COMMAND
running command...
$ dops (-v|--version|version)
@doptools/cli/0.0.0-dev.5 linux-x64 node-v14.15.5
$ dops --help [COMMAND]
USAGE
  $ dops COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dops `](#dops-)
* [`dops help [COMMAND]`](#dops-help-command)
* [`dops update [CHANNEL]`](#dops-update-channel)

## `dops `

```
USAGE
  $ dops
```

_See code: [src/commands/index.ts](https://github.com/doptools/cli/blob/v0.0.0-dev.5/src/commands/index.ts)_

## `dops help [COMMAND]`

display help for dops

```
USAGE
  $ dops help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `dops update [CHANNEL]`

update the dops CLI

```
USAGE
  $ dops update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.10/src/commands/update.ts)_
<!-- commandsstop -->
