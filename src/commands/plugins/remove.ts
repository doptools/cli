import { Argument, CliCommand, CommandBase } from '@doptools/tslib-cli-core';
import { uninstallPlugin } from '../../util/plugins';

@CliCommand({})
export default class PluginRemoveCommand extends CommandBase {

    @Argument({
        required: true,
        description: 'The plugin to remove'
    })
    public plugin?: string;

    async run(): Promise<any> {
        await uninstallPlugin(this.config, this.plugin!, { verbose: true });
    }


}
