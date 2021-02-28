import { CliCommand, CommandBase, Shell } from '@doptools/cli-core';

@CliCommand({
    description: "Run dops commands in the workspace context",
    cliContext: 'project',
    disabled: context => !context.hasWorkspace
})
export default class WorkspaceContextDummyCommand extends CommandBase {
    async run(): Promise<any> {}
}
