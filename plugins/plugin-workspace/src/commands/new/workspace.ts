import { Argument, BooleanFlag, CliCommand, CommandBase, SchematicRunner, StringFlag } from '@doptools/cli-core';
import { properties } from '../../schematics/new/schema.json';
@CliCommand({
    description: "Dummy"
})
export default class NewWorkspaceCommand extends CommandBase {

    @BooleanFlag()
    protected force?: boolean;

    @BooleanFlag()
    protected dryRun?: boolean;

    @BooleanFlag()
    protected interactive?: boolean;

    @BooleanFlag({
        description: properties.skipGit.description
    })
    protected skipGit?: boolean;

    @BooleanFlag({
        description: properties.skipInstall.description
    })
    protected skipInstall?: boolean;

    @StringFlag({
        description: properties.repository.description
    })
    protected repository?: string;

    @StringFlag({
        description: properties.author.description
    })
    protected author?: string;


    @Argument({
        description: properties.directory.description
    })
    protected directory?: string;


    async run(): Promise<void> {
        await SchematicRunner.create('./new', {
            verbose: this.verbose,
            force: this.force,
            dryRun: this.dryRun,
            interactive: this.interactive,
            mode: 'rw'
        }).execute({
            directory: this.directory,
            repository: this.repository,
            author: this.author,
            skipGit: this.skipGit,
            skipInstall: this.skipInstall,
        });
    }
}
