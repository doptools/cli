import { CliCommand, CommandBase, Shell } from '@doptools/cli-core';

@CliCommand({
    description: "Run dops commands in the global context",
    cliContext: '!global'
})
export default class GlobalContextDummyCommand extends CommandBase {
    async run(): Promise<any> {}
}
