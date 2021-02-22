import { Argument, CliCommand, CommandBase } from '@doptools/tslib-cli-core';
import { installPlugin } from '../../util/plugins';

@CliCommand({})
export default class PluginAddCommand extends CommandBase {

    @Argument({
        required: true,
        description: 'The plugin to add'
    })
    public plugin?:string;

    async run(): Promise<any> {
        await installPlugin(this.config, this.plugin!, { verbose: true });
    }


}
