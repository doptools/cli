
import { CliContext, PluginManager } from '@doptools/cli-core';
import { run } from '@oclif/command';
import flush from '@oclif/command/flush';
import { handle } from '@oclif/errors';
import chalk from 'chalk';
import Path from 'path';
import * as Config from '@oclif/config'
//Config.Config

function spawnContext(bin: string, argv: string[]) {
    console.info(chalk.gray(`Switching to ${chalk.blueBright(process.env.DOPS_CLI__CONTEXT_TARGET)} context...`));
    const children = require('child_process');
    const result = children.spawnSync(bin, argv, { stdio: 'inherit', cwd: process.cwd() });
    process.exit(result.status);
}

async function execute(argv: string[], config:Config.IConfig) {
    console.info(chalk.gray(`Loaded ${chalk.blueBright(process.env.DOPS_CLI__CONTEXT)} context.`));
    try {
        await run(argv, config);
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
        let config = await Config.load(__filename);
        const changed = await (await PluginManager.create(config)).syncPlugins();
        if(changed){
            config = await Config.load(__filename);
        }
        await execute(argv.slice(2), config);
    } else {
        if (cliContext.targetBinPath) {
            spawnContext(Path.join(cliContext.targetBinPath, 'bin', 'run'), argv.slice(2));
        } else {
            throw new Error(`Unable to switch context from '${cliContext.contextType}' to '${cliContext.targetContextType}'`);
        }
    }
}
