
// Cannot use runtime dependancies here as this will run before the package manager has installed them.
// types and node default modules are ok

import type { PJSON } from '@oclif/config';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import Path from 'path';
import type { PackageJson } from 'type-fest';

function readSync(path: string): PackageJson {
    return JSON.parse(readFileSync(path, { encoding: 'utf-8' }));
}
function writeSync(path: string, data: any): void {
    writeFileSync(path, JSON.stringify(data, undefined, 4));
}

function findUpPackagePath(path: string): string | null {
    const root = Path.resolve('/');
    path = Path.normalize(path);
    while (true) {
        const pkg = Path.join(path, 'package.json');
        if (existsSync(pkg)) {
            return pkg;
        }
        if (!path || root === path) {
            return null;
        }
        path = Path.dirname(path);
    }
}

export default function initializePlugins() {
    let changed = false;
    try {
        const pkgSearchPath = Path.normalize(Path.join(process.cwd(), '..'));
        const pkgPath = findUpPackagePath(pkgSearchPath);
        if (pkgPath !== null) {
            const pkg = readSync(pkgPath) as PackageJson & { dops: any };
            if (Array.isArray(pkg.dops?.plugins)) {
                const cliPkgSearchPath = Path.normalize(Path.join(process.cwd()));
                const cliPkgPath = findUpPackagePath(cliPkgSearchPath);
                const cliPkg = readSync(cliPkgPath!) as PackageJson & { dops: any } & PJSON.CLI;
                const cliPlugins: Array<string | PJSON.PluginTypes.User | PJSON.PluginTypes.Link> = cliPkg.oclif.plugins = cliPkg.oclif.plugins ?? [];
                const cliDeps = cliPkg.dependencies = cliPkg.dependencies ?? {};

                const plugins: PJSON.PluginTypes.User[] = pkg.dops.plugins;
                plugins.forEach(async plugin => {
                    const installedPlugin = cliPlugins.find(p => typeof p === 'string' ? p === plugin.name : p.name == plugin.name);
                    if (!installedPlugin) {
                        changed = true;
                        cliPlugins.push(plugin);

                    }
                    if (!cliDeps[plugin.name]) {
                        changed = true;
                        cliDeps[plugin.name] = plugin.tag!;
                    }
                });
                if (changed) {
                    writeSync(cliPkgPath!, cliPkg);
                }
                return changed;
            }
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
    return changed;
}
