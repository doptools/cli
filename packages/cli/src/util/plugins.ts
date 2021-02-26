import { Yarn } from '@doptools/cli-core';
import { IConfig, PJSON } from '@oclif/config';
import { Octokit } from '@octokit/rest';
import { realpathSync } from 'fs';
import http from 'http';
import { jsonc } from 'jsonc';
import packageArgs from 'npm-package-arg';
import Path from 'path';
import resolvePackage, { findUpPackagePath } from 'resolve-package-path';
import { PackageJson } from 'type-fest';

export interface IPluginInstallOptions {
    force: boolean;
    verbose: boolean;
}

async function resolvePackageInfo(plugin: string) {
    const result = packageArgs(plugin);
    switch (result.type) {
        case 'version':
        case 'tag':
            break;
        case 'directory':
            const pluginPkg = await jsonc.read(Path.join(result.fetchSpec!, 'package.json')) as PackageJson;
            addPackageInfo(result, pluginPkg);
            break;
        case 'git':
            await resolvePackageInfoFromGit(plugin, result as packageArgs.HostedGitResult);
            break;
        default:
            console.warn('unsuported:', result)
            return null;
    }
    return result;
}

function addPackageInfo(result: packageArgs.Result, pkg: PackageJson): void {
    result.name = pkg.name!;
    result.escapedName = escape(result.name);
    if (result.name.startsWith('@')) {
        result.scope = result.name.split('/', 2)[0];
    }
}

async function resolvePackageInfoFromGit(plugin: string, info: packageArgs.HostedGitResult) {
    switch (info.hosted.type) {
        case 'github':
            const gh: packageArgs.HostedGit & { filetemplate?: string } = info.hosted;
            const api = new Octokit();
            info.gitCommittish ??= (await api.repos.get({ owner: gh.user, repo: gh.project })).data.default_branch;
            const fileinfo = await api.repos.getContent({
                owner: gh.user,
                repo: gh.project,
                ref: info.gitCommittish,
                path: 'package.json'
            })
            let pkgContent = '';

            if (!(fileinfo.data as any).content) {
                const res = await new Promise<http.IncomingMessage>(resolve => {
                    http.get((fileinfo.data as any).download_url, resolve);
                });
                let data = await new Promise<string>((resolve, reject) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('error', err => reject(err));
                    res.on('end', () => resolve(data));
                });
                pkgContent = jsonc.parse(data)

            } else {
                const content = (fileinfo.data as any).content as string;
                pkgContent = Buffer.from(content, 'base64').toString('utf-8');
            }
            const pkg = jsonc.parse(pkgContent, { stripComments: true });
            addPackageInfo(info, pkg);
            break;
        default:
            throw new Error(`unsupported git host ${info.hosted.type}`)

    }
}


export const PATH_CLI_BIN = Path.dirname(realpathSync(process.argv[1]));
export const PATH_CLI_PACKAGEJSON = findUpPackagePath(PATH_CLI_BIN);
export const PATH_CLI = Path.dirname(PATH_CLI_PACKAGEJSON);


export async function readCliPackageJson() {
    return await jsonc.read(PATH_CLI_PACKAGEJSON) as PackageJson;
}

export async function writeCliPackageJson(data: PackageJson) {
    return await jsonc.write(PATH_CLI_PACKAGEJSON, data, { space: 2 });
}

export async function installPlugin(config: IConfig, plugin: string, opts: Partial<IPluginInstallOptions> = {}) {
    const pluginSource = await resolvePackageInfo(plugin);
    if (pluginSource === null) {
        throw new Error(`Usupported plugin source: '${plugin}'`);
    }
    const pluginName = pluginSource.name!;
    const pluginSpec = {
        type: 'user',
        name: pluginName,
        url: pluginSource.raw,
        tag: pluginSource.gitCommittish ?? pluginSource.fetchSpec
    } as PJSON.PluginTypes.User;

    if (process.env.GLOBAL_CLI !== 'true') {
        const localPkgPath = Path.join(process.cwd(), 'package.json');

        const localPkg = await jsonc.read(localPkgPath, { stripComments: true }) as PackageJson & { dops?: { plugins?: PJSON.PluginTypes.User[] } };
        localPkg.dops ??= {};
        localPkg.dops.plugins ??= [];
        const index = localPkg.dops.plugins.findIndex(p => pluginName === p.name);
        if (index === -1) {
            localPkg.dops.plugins.push(pluginSpec);
        } else {
            localPkg.dops.plugins.splice(index, 1, pluginSpec);
        }
        await jsonc.write(localPkgPath, localPkg, { space: 2 });
    }

    await installPluginSpec(pluginSpec);
}

async function installPluginSpec(pluginSpec: PJSON.PluginTypes.User) {
    const plugin = pluginSpec.url!;
    const pluginName = pluginSpec.name!;
    const installed = !!resolvePackage(pluginName, PATH_CLI);

    let code;
    if (code = Yarn.add(plugin, { cwd: PATH_CLI })) {
        throw new Error(`Could not add package '${plugin}'. Yarn exited with code: ${code}`);
    }

    const pluginPkgPath = resolvePackage(pluginName, PATH_CLI, false)!;
    const pluginPkg = await jsonc.read(pluginPkgPath) as PJSON.Plugin;
    if (!pluginPkg.oclif) {
        if (!installed) {
            Yarn.remove(plugin, { cwd: PATH_CLI });
        }
        throw new Error(`'${plugin} is not a valid plugin`);
    }

    const cliPackage = await readCliPackageJson() as PJSON.User;

    cliPackage.oclif.plugins ??= [];
    const plugins = cliPackage.oclif.plugins;


    const index = plugins.findIndex(p => typeof p === 'string' ? pluginName === p : pluginName === p.name);
    if (index === -1) {
        plugins.push(pluginSpec);
    } else {
        if (typeof plugins[index] !== 'string') {
            plugins.splice(index, 1, pluginSpec);
        }
    }

    await writeCliPackageJson(cliPackage);
}

export async function uninstallPlugin(config: IConfig, plugin: string, opts: Partial<IPluginInstallOptions> = {}) {
    const cliPackage = await readCliPackageJson() as PJSON.User;
    cliPackage.oclif.plugins ??= [];
    const plugins = cliPackage.oclif.plugins;
    const index = plugins.findIndex(p => typeof p === 'string' ? plugin === p : plugin === p.name);
    if (index !== -1) {
        plugins.splice(index, 1);
    }
    await writeCliPackageJson(cliPackage);
    Yarn.remove(plugin, { cwd: PATH_CLI });
}

