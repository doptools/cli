import { Argument, CliCommand, CommandBase, PluginManager } from '@doptools/cli-core';


@CliCommand({})
export default class PluginRemoveCommand extends CommandBase {

    @Argument({
        required: true,
        description: 'The plugin to remove'
    })
    public plugin?: string;

    async run(): Promise<any> {
        const pm = await PluginManager.forContext();
        await pm.removePlugin(this.plugin!);
    }


}
