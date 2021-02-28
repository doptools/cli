import { CliContext, CommandContext, ICliCommandDescription } from '@doptools/cli-core';
import { Hook } from '@oclif/config';
import * as mm from 'multimatch';
const multimatch: typeof mm.default = mm as any;

const hook: Hook<'init'> = async function (options) {
  const context = await CliContext.instance;
  options.config.commands.filter(cmd => {
    const cmdClass = cmd.load() as ICliCommandDescription;
    if (cmdClass.disabled && cmdClass.disabled(context)) {
      return true;
    }
    const m = multimatch(
      context.contextType ?? CommandContext.GLOBAL,
      cmdClass.cliContext ?? CommandContext.Any,
      { nocase: true }
    );
    return !m.length;
  }).forEach(cmd => {
    cmd.hidden = true;
    cmd.id = `__disabled_command__${cmd.id}`;
  });
}

export default hook;