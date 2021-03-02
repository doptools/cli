import { IConfig, PJSON } from '@oclif/config';
import { jsonc } from 'jsonc';
import { join } from 'path';
import { PackageJson } from 'type-fest';
import { IDopsConfig } from '../config';
import { NodeUtil } from "../util/NodeUtil";
import { Yarn } from '../yarn/Yarn';
import { CliContext } from './../cli/CliContext';


export class PluginManager {
    private static _instance?: Promise<PluginManager>;

    public static forContext(): Promise<PluginManager> {
        if (!this._instance) {
            this._instance = new Promise(async res => {
                res(new PluginManager(await CliContext.instance));
            });
        }
        return this._instance;
    }

    private constructor(private readonly context: CliContext) { }


    public async listPlugins(config: IConfig) {
        const binPkg = await jsonc.read(join(this.context.binPath!, 'package.json')) as PJSON.User;
        return config.plugins.map(p => {
            return {
                type: binPkg.oclif.plugins
                    ?.filter(_ => typeof _ === 'string' ? _ === p.name : _.name === p.name)
                    ?.map(_ => typeof _ === 'string' ? (_ === '@doptools/cli' ? 'main' : 'core') : _.type)[0] ?? 'main',
                name: p.name,
                version: p.version,
                valid: p.valid
            };
        });
    }


    public async addPlugin(plugin: string) {
        if (this.context.contextType === 'global') {
            return this.addGlobalPlugin(plugin);
        }
        Yarn.add(plugin, { dev: true, cwd: this.context.contextPath });
        const info = NodeUtil.packageInfo(plugin);
        await this.savePluginConfig(this.context.contextPackageJsonPath!, info.name!);
    }

    public async removePlugin(plugin: string) {
        if (this.context.contextType === 'global') {
            return this.removeGlobalPlugin(plugin);
        }
        const info = NodeUtil.packageInfo(plugin);
        Yarn.remove(info.name!, { cwd: this.context.contextPath });
        await this.savePluginConfig(this.context.contextPackageJsonPath!, info.name!, null);
    }

    public async syncPlugins() {
        if (this.context.contextType !== 'global') {
            return this.syncGlobalPlugins();
        }
        const contextPkg = await jsonc.read(this.context.contextPackageJsonPath!) as PackageJson & IDopsConfig;
        const binPkg = await jsonc.read(join(this.context.binPath!, 'package.json')) as PJSON.User;
        binPkg.oclif.plugins ??= [];
        binPkg.oclif.plugins = binPkg.oclif.plugins.filter(p => typeof p === 'string' ? true : p.type !== 'user');
        if (contextPkg.dops?.plugins) {
            for (const name in contextPkg.dops.plugins) {
                if (Object.prototype.hasOwnProperty.call(contextPkg.dops.plugins, name)) {
                    const tag = contextPkg.dops.plugins[name];
                    binPkg.oclif.plugins.push({
                        type: 'user',
                        name,
                        tag
                    } as PJSON.PluginTypes.User)
                }
            }
            await jsonc.write(join(this.context.binPath!, 'package.json'), binPkg);
        }
    }

    private async savePluginConfig(path: string, pluginName: string, version?: string | null) {
        const pkg = await jsonc.read(path) as PackageJson & IDopsConfig;
        const ref = { ...pkg };
        ref.devDependencies ??= {};
        ref.dependencies ??= {};
        ref.peerDependencies ??= {};
        pkg.dops ??= { plugins: {} };
        pkg.dops.plugins ??= {};
        if (version === null) {
            delete pkg.dops.plugins[pluginName];
        } else {
            version ??= ref.devDependencies[pluginName] ?? ref.dependencies[pluginName] ?? ref.peerDependencies[pluginName];
            pkg.dops.plugins[pluginName] = version ?? 'latest';
        }
        await jsonc.write(path, pkg, { space: 4 });
    }

    private async syncGlobalPlugins() {
        
    }

    private async addGlobalPlugin(plugin: string) {
        const info = NodeUtil.packageInfo(plugin);
    }

    private async removeGlobalPlugin(plugin: string) {
        const info = NodeUtil.packageInfo(plugin);
    }
}