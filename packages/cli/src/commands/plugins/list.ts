import { BooleanFlag, CliCommand, CommandBase, PluginManager } from '@doptools/cli-core';
import { IPlugin, PJSON } from '@oclif/config';
import cli from 'cli-ux';

@CliCommand({})
export default class PluginsListCommand extends CommandBase {

    @BooleanFlag()
    public all?: boolean = false;
    @BooleanFlag()
    public long?: boolean = false;

    async run(): Promise<any> {

        const pm = await PluginManager.forContext();
        const plugins = (await pm.listPlugins(this.config)).filter(p => this.all ? true : p.type === 'user');

        if (!this.long) {
            this.log(plugins.map(_ => `${_.name}@${_.version}`).join(' '));
        } else {
            cli.table(plugins, {
                name: {},
                type: { minWidth: 8 },
                version: {},
                valid: {},
            });
        }
    }
}
