
// Cannot use dependancies here. this will run before the package manager has installed them

import type { PJSON } from '@oclif/config';
import type { PackageJson } from 'type-fest';
//import { jsonc } from 'jsonc';
//import { findUpPackagePath } from 'resolve-package-path';
import Path from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs'

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

export function initPlugins() {
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

                var plugins: PJSON.PluginTypes.User[] = pkg.dops.plugins;
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
                    // Shell.exec('yarn', { cwd: Path.dirname(cliPkgPath) });
                }
                return changed;
            }
        }
    } catch (e) {
        console.log((e as Error).name);
        console.log((e as Error).message);
        console.log((e as Error).stack);
        throw e;
    }
    return changed;
}