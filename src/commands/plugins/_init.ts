import { CliCommand, CommandBase } from '@doptools/tslib-cli-core';

@CliCommand({
    hidden: true
})
export default class PluginsInitCommand extends CommandBase {

    async run(): Promise<any> {
        this.log('PluginsInitCommand');
        this.log(process.env.GLOBAL_CLI);
        throw new Error();
    }
}
