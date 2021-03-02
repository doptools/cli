import { CliCommand, CommandBase } from '@doptools/cli-core';

@CliCommand({
    description: "Dummy"
})
export default class GlobalContextDummyCommand extends CommandBase {
    async run(): Promise<any> {

    }
}
