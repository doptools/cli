import chalk from 'chalk';
import Path from 'path';
import resolvePackagePath from 'resolve-package-path';


//console.log(process.argv);

function spawnContext(bin: string, argv: string[]) {
    console.info(chalk.gray('Switching to local version'));
    const children = require('child_process');
    const result = children.spawnSync(bin, argv, { stdio: 'inherit', cwd: process.cwd() });
    process.exit(result.status);
}

/*
function checkVersions(currentPkg: PackageJson, localPkg: PackageJson) {
    const currentVersion = semver.parse(currentPkg.version);
    const localVersion = semver.parse(localPkg.version);

    switch (currentVersion.compare(localVersion)) {
        case 1:
            console.warn(chalk.yellow(`The project's cli ${chalk.white(`[${localVersion.version}]`)} is older that the gobal ${chalk.white(`[${currentVersion.version}]`)}. 
Consiger updating using \`${chalk.white('npm i -D @doptools/cli@latest')}\` or \`${chalk.white('yarn add -D @doptools/cli@latest')}\``));
            break;
        case -1:
            console.warn(chalk.yellow(`The project's cli ${chalk.white(`[${localVersion.version}]`)} is newer that the gobal ${chalk.white(`[${currentVersion.version}]`)}. 
Consiger updating using \`${chalk.white('npm i -g @doptools/cli@latest')}\` or \`${chalk.white('yarn global add @doptools/cli@latest')}\``));
            break;
    }
}
*/
async function execute(argv: string[], global: boolean) {
    process.env.GLOBAL_CLI = '' + global;
    try {
        await require('@oclif/command').run(argv)
            .then(require('@oclif/command/flush'));
    } catch (e) {
        if (e.code !== 'EEXIT') {
            console.error(e);
        }
        require('@oclif/errors/handle')(e);
    }
}

export default function main(argv: string[]) {
    const binPath = Path.dirname(Path.dirname(argv[1]));
    const cwd = process.cwd();
    let resolved = resolvePackagePath('@doptools/cli', cwd);
    resolved = resolved ? Path.dirname(resolved) : null;

    const noLocal = resolved === null;
    const isInstall = cwd === resolved;
    const isDebug = cwd === binPath;
    let isGlobal = true;
    if (!isInstall) {
        isGlobal = noLocal || binPath !== resolved;
    }

    argv = argv.slice(2);
    const forceGlobal = argv[0] === 'global';
    if (forceGlobal) {
        argv.shift();
    }
    /*
        console.log('cwd       :', cwd);
        console.log('resolved  :', resolved);
        console.log('binPath   :', binPath);
    
        console.log('noLocal      :', noLocal);
        console.log('isInstall    :', isInstall);
        console.log('isGlobal     :', isGlobal);
        console.log('isDebug      :', isDebug);
        console.log('forceGlobal  :', forceGlobal);
    */
    if (isInstall) {
        return;
    }

    if (isDebug || noLocal || forceGlobal === isGlobal) {
        execute(argv, isDebug || isGlobal);
        return;
    }

    if (isGlobal) {
        spawnContext(Path.join(resolved!, 'bin', 'run'), argv);
        return;
    }
    throw new Error("NYI: local cli trying to run globally");
}
