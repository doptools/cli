import { CliContext } from '@doptools/cli-core';
import chalk from 'chalk';
import Path from 'path';

function spawnContext(bin: string, argv: string[]) {
    console.info(chalk.gray('Switching to local version'));
    const children = require('child_process');
    const result = children.spawnSync(bin, argv, { stdio: 'inherit', cwd: process.cwd() });
    process.exit(result.status);
}

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

export default async function main(argv: string[]) {
    const cliContext = await CliContext.instance;
    if (cliContext?.isCorrectContext) {
        await execute(argv.slice(2), cliContext.contextType === 'global');
    } else {
        if (cliContext?.targetBinPath) {
            spawnContext(Path.join(cliContext.targetBinPath, 'bin', 'run'), argv.slice(2));
        } else {
            throw new Error(`Unable to switch context from '${cliContext?.contextType}' to '${cliContext?.targetContextType}'`);
        }
    }
}
