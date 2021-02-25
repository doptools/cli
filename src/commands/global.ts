import { CliCommand, CommandBase, Shell } from '@doptools/tslib-cli-core';

@CliCommand({
    description: "Initialize Project",
    hidden: process.env.GLOBAL_CLI === 'true'
})
export default class InitProjectCommand extends CommandBase {
    async run(): Promise<any> {
        Shell.exec(`yarn`);
    }
}
