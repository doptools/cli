
import { IConfig, IPlugin, PJSON } from '@oclif/config';
import { jsonc } from 'jsonc';
import { join } from 'path';
import { PackageJson } from 'type-fest';
import { IDopsConfig } from '../config';
import { NodeUtil } from "../util/NodeUtil";
import { Yarn } from '../yarn/Yarn';
import { CliContext } from './../cli/CliContext';

type Defered<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    readonly resolved: boolean;
    readonly rejected: boolean;
    readonly complete: boolean;
};
declare type Mutable<T extends object> = {
    -readonly [K in keyof T]: T[K]
}

function defer<T>(): Defered<T> {
    const ret: Partial<Mutable<Defered<T>>> = {
        complete: false,
        resolved: false,
        rejected: false
    };
    ret.promise = new Promise((res, rej) => {
        ret.resolve = (value: T | PromiseLike<T>) => {
            if (ret.complete) {
                throw new Error("The promise has already been completed");
            }
            ret.complete = true;
            ret.resolved = true;
            res(value);
        };
        ret.reject = (reason?: any) => {
            if (ret.complete) {
                throw new Error("The promise has already been completed");
            }
            ret.complete = true;
            ret.rejected = true;
            rej(reason);
        };
    });
    return ret as Defered<T>;
}


export class PluginManager {
    private static _instance: Defered<PluginManager> = defer();


    public static get instance(): Promise<PluginManager> {
        return this._instance.promise;
    }


    public static create(config: IConfig): Promise<PluginManager> {
        // tslint:disable-next-line: no-floating-promises
        (async () => {
            this._instance.resolve(new PluginManager(await CliContext.instance, config));
        })();
        return this.instance;
    }

    private constructor(
        private readonly context: CliContext,
        private readonly config: IConfig
    ) { }


    public async listPlugins(config: IConfig) {
        if (this.context.contextType === 'global') {
            return this.listGlobalPlugins();
        }
        const binPkg = await jsonc.read(join(await this.context.binPath, 'package.json')) as PJSON.User;
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

    public async listGlobalPlugins() {
        const config = this.config;
        function getType(plugin:IPlugin){
            if(plugin.name === '@doptools/cli'){
                return 'main';
            }else{
                const cfg = config.pjson as PJSON.User;
                return cfg.oclif.plugins
                    ?.filter(p => typeof p === 'string' ? plugin.name === p : plugin.name === p.name)
                    .map(p => typeof p === 'string' ? 'core' : p.type)[0];
            }
        }
         return this.config.plugins.map(p => { 
            return {
                type: getType(p),
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
        if (this.context.contextType === 'global') {
            return this.syncGlobalPlugins();
        }
        const contextPkg = await jsonc.read(this.context.contextPackageJsonPath!) as PackageJson & IDopsConfig;
        const binPkg = await jsonc.read(join(await this.context.binPath, 'package.json')) as PJSON.User;
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
            await jsonc.write(join(await this.context.binPath, 'package.json'), binPkg);
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