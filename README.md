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
@doptools/cli/0.0.3-dev.0 linux-x64 node-v14.15.5
$ dops --help [COMMAND]
USAGE
  $ dops COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dops hello [FILE]`](#dops-hello-file)
* [`dops help [COMMAND]`](#dops-help-command)

## `dops hello [FILE]`

describe the command here

```
USAGE
  $ dops hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ dops hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/doptools/cli/blob/v0.0.3-dev.0/src/commands/hello.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_
<!-- commandsstop -->
