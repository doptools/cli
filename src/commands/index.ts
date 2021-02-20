import { CliCommand, CommandBase } from '@doptools/tslib-cli-core'
import { findProjectRoot } from '../util/project';

@CliCommand({})
export default class DefaultCommand extends CommandBase {


    async run(): Promise<any> {
        const pr = findProjectRoot();
        this.log('hi');
        this.log(pr ?? ';(');
    }


}
