@doptools/cli
=========

build and deployment tools


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
@doptools/cli/0.0.0-dev.20 linux-x64 node-v14.15.5
$ dops --help [COMMAND]
USAGE
  $ dops COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dops global`](#dops-global)
* [`dops help [COMMAND]`](#dops-help-command)
* [`dops plugins:add PLUGIN`](#dops-pluginsadd-plugin)
* [`dops plugins:list`](#dops-pluginslist)
* [`dops plugins:remove PLUGIN`](#dops-pluginsremove-plugin)
* [`dops update [CHANNEL]`](#dops-update-channel)

## `dops global`

Run dops commands in the global context

```
USAGE
  $ dops global

OPTIONS
  -v, --verbose
```

_See code: [src/commands/global.ts](https://github.com/doptools/cli/blob/v0.0.0-dev.20/src/commands/global.ts)_

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

## `dops plugins:add PLUGIN`

```
USAGE
  $ dops plugins:add PLUGIN

ARGUMENTS
  PLUGIN  The plugin to add

OPTIONS
  -v, --verbose
```

_See code: [src/commands/plugins/add.ts](https://github.com/doptools/cli/blob/v0.0.0-dev.20/src/commands/plugins/add.ts)_

## `dops plugins:list`

```
USAGE
  $ dops plugins:list

OPTIONS
  -a, --all
  -v, --verbose
```

_See code: [src/commands/plugins/list.ts](https://github.com/doptools/cli/blob/v0.0.0-dev.20/src/commands/plugins/list.ts)_

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

_See code: [src/commands/plugins/remove.ts](https://github.com/doptools/cli/blob/v0.0.0-dev.20/src/commands/plugins/remove.ts)_
