import { CliCommand, CommandBase, Shell } from '@doptools/cli-core';

@CliCommand({
    description: "Run dops commands in the global context",
    hidden: process.env.GLOBAL_CLI === 'true'
})
export default class InitProjectCommand extends CommandBase {
    async run(): Promise<any> {
        Shell.exec(`yarn`);
    }
}
