import { BooleanFlag, CliCommand, CommandBase } from '@doptools/cli-core';
import { IPlugin, PJSON } from '@oclif/config';
import cli from 'cli-ux';
import { readCliPackageJson } from '../../util/plugins';


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

    async run(): Promise<any> {
        const cliPkg = await readCliPackageJson() as PJSON.User;

        let plugins = this.config.plugins
            .map(plugin => ({
                name: plugin.name,
                type: getPluginType(cliPkg, plugin),
                valid: plugin.valid,
                version: plugin.version
            }))

        if (!this.all) {
            plugins = plugins.filter(_ => _.type !== 'main' && _.type !== 'core');
        }

        cli.table(plugins, {
            name: {},
            type: { minWidth: 8 },
            version: {}
        });
    }


}
