import { CliContext } from '@doptools/cli-core';
import chalk from 'chalk';
import Path from 'path';

import { run } from '@oclif/command';
import flush from '@oclif/command/flush';
import { handle } from '@oclif/errors';

function spawnContext(bin: string, argv: string[]) {
    console.info(chalk.gray(`Switching context: ${process.env.DOPS_CLI__CONTEXT_TARGET}`));
    const children = require('child_process');
    const result = children.spawnSync(bin, argv, { stdio: 'inherit', cwd: process.cwd() });
    process.exit(result.status);
}

async function execute(argv: string[]) {
    console.info(chalk.gray(`Running context: ${process.env.DOPS_CLI__CONTEXT}`));
    try {
        await run();
        await flush();
    } catch (e) {
        if (e.code !== 'EEXIT') {
            console.error(e);
        }
        handle(e);
    }
}

export default async function main(argv: string[]) {
    const cliContext = await CliContext.instance;
    process.env.DOPS_CLI__CONTEXT = cliContext.contextType;
    process.env.DOPS_CLI__CONTEXT_TARGET = cliContext.targetContextType;

    if (cliContext.isCorrectContext) {
        await execute(argv.slice(2));
    } else {
        if (cliContext.targetBinPath) {
            spawnContext(Path.join(cliContext.targetBinPath, 'bin', 'run'), argv.slice(2));
        } else {
            throw new Error(`Unable to switch context from '${cliContext.contextType}' to '${cliContext.targetContextType}'`);
        }
    }
}
