import { Argument, CliCommand, CommandBase, PluginManager } from '@doptools/cli-core';

@CliCommand({})
export default class PluginAddCommand extends CommandBase {

    @Argument({
        required: true,
        description: 'The plugin to add'
    })
    public plugin?: string;

    async run(): Promise<any> {
        const pm = await PluginManager.forContext();
        await pm.addPlugin(this.plugin!);
    }


}
