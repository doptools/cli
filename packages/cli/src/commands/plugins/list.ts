import { BooleanFlag, CliCommand, CommandBase, PluginManager } from '@doptools/cli-core';
import { IPlugin, PJSON } from '@oclif/config';
import cli from 'cli-ux';
import { readCliPackageJson } from '../../util/plugin';


function getPluginType(cliPkg: PJSON.User, plugin: IPlugin): 'unknown' | 'core' | 'user' | 'link' | 'main' {
    const pluginDef = cliPkg.oclif.plugins?.find(p => typeof p === 'string' ? p === plugin.name : p.name === plugin.name);
    if (!pluginDef) {
        return plugin.name === '@doptools/cli' ? 'main' : 'unknown';
    }
    if (typeof pluginDef === 'string') {
        return 'core';
    }
    return pluginDef.type;
}

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
