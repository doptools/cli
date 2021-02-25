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
@doptools/cli/0.0.0-dev.9 linux-x64 node-v14.15.5
$ dops --help [COMMAND]
USAGE
  $ dops COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dops help [COMMAND]`](#dops-help-command)
* [`dops init`](#dops-init)
* [`dops plugins:add PLUGIN`](#dops-pluginsadd-plugin)
* [`dops plugins:list`](#dops-pluginslist)
* [`dops plugins:remove PLUGIN`](#dops-pluginsremove-plugin)
* [`dops update [CHANNEL]`](#dops-update-channel)

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

## `dops init`

Initialize Project

```
USAGE
  $ dops init

OPTIONS
  -v, --verbose
```

_See code: [src/commands/init.ts](https://github.com/doptools/cli/blob/v0.0.0-dev.9/src/commands/init.ts)_

## `dops plugins:add PLUGIN`

```
USAGE
  $ dops plugins:add PLUGIN

ARGUMENTS
  PLUGIN  The plugin to add

OPTIONS
  -v, --verbose
```

_See code: [src/commands/plugins/add.ts](https://github.com/doptools/cli/blob/v0.0.0-dev.9/src/commands/plugins/add.ts)_

## `dops plugins:list`

```
USAGE
  $ dops plugins:list

OPTIONS
  -a, --all
  -v, --verbose
```

_See code: [src/commands/plugins/list.ts](https://github.com/doptools/cli/blob/v0.0.0-dev.9/src/commands/plugins/list.ts)_

## `dops plugins:remove PLUGIN`

```
USAGE
  $ dops plugins:remove PLUGIN

ARGUMENTS
  PLUGIN  The plugin to remove

OPTIONS
  -a, --all
  -v, --verbose
```

_See code: [src/commands/plugins/remove.ts](https://github.com/doptools/cli/blob/v0.0.0-dev.9/src/commands/plugins/remove.ts)_

## `dops update [CHANNEL]`

update the dops CLI

```
USAGE
  $ dops update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.10/src/commands/update.ts)_
<!-- commandsstop -->
