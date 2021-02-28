import { CliCommand, CommandBase, Shell } from '@doptools/cli-core';

@CliCommand({
    description: "Initialize Project",
   // hidden: !existsSync(Path.join(process.cwd(), 'package.json')) || existsSync(Path.join(process.cwd(), 'node_modules'))
})
export default class InitProjectCommand extends CommandBase {
    async run(): Promise<any> {
        Shell.exec(`yarn`);
    }
}
