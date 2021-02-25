import type { PJSON } from '@oclif/config';
import { jsonc } from 'jsonc';
import Path from 'path';
import { findUpPackagePath } from 'resolve-package-path';
import type { PackageJson } from 'type-fest';

export function initPlugins() {
    let changed = false;
    try {
        const pkgSearchPath = Path.normalize(Path.join(process.cwd(), '..'));
        console.log('pkgSearchPath   :', pkgSearchPath);
        const pkgPath = findUpPackagePath(pkgSearchPath);
        if (pkgPath != null) {
            console.log('pkgPath         :', pkgPath);
            const pkg = jsonc.readSync(pkgPath) as PackageJson & { dops: any };
            console.log('pkg             :', pkg);

            if (Array.isArray(pkg.dops?.plugins)) {
                const cliPkgSearchPath = Path.normalize(Path.join(process.cwd()));
                console.log('cliPkgSearchPath:', cliPkgSearchPath);
                const cliPkgPath = findUpPackagePath(cliPkgSearchPath);
                const cliPkg = jsonc.readSync(cliPkgPath) as PackageJson & { dops: any } & PJSON.CLI;
                const cliPlugins: Array<string | PJSON.PluginTypes.User | PJSON.PluginTypes.Link> = cliPkg.oclif.plugins = cliPkg.oclif.plugins ?? [];
                const cliDeps = cliPkg.dependencies = cliPkg.dependencies ?? {};
                
                var plugins: PJSON.PluginTypes.User[] = pkg.dops.plugins;
                console.log('plugins         :', plugins);

                plugins.forEach(async plugin => {
                    console.log('plugin         :', plugin);
                    const installedPlugin = cliPlugins.find(p => typeof p === 'string' ? p === plugin.name : p.name == plugin.name);
                    console.log('installedPlugin', installedPlugin);
                    if (!installedPlugin) {
                        changed = true;
                        cliPlugins.push(plugin);
                        
                    }
                    if(!cliDeps[plugin.name]){
                        changed = true;
                        cliDeps[plugin.name] = plugin.tag!;
                    }
                    // if (installedPlugin) {

                    //  } else {
                    //   cliPkg.dependencies ??= {};
                    //    changed = true;
                    //if (cliPkg.dependencies[plugin.url!]) {
                    //const curVer =  semver.parse pkg.dependencies[plugin.url!];
                    //     return;
                    //  }
                    //   cliPkg.dependencies[plugin.url!] = plugin.tag!;
                    //    }
                });
                if (changed) {
                    console.log('changed!!!!!!!!!');
                    jsonc.writeSync(cliPkgPath, cliPkg, { space: 2 });
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