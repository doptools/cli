import {
    apply,
    chain,
    empty,
    mergeWith,
    move,
    Rule,
    schematic,
    SchematicContext,
    Tree
} from "@angular-devkit/schematics";
import {
    NodePackageInstallTask,
    RepositoryInitializerTask
} from "@angular-devkit/schematics/tasks";
import type { WorkspaceOptions } from "../workspace/schema";
import type { NewWorkspaceOptions } from "./schema";


export default function (options: NewWorkspaceOptions): Rule {
    options.directory ??= '.';

    const workspaceOptions: WorkspaceOptions = {
        author: options.author,
        repository: options.repository
    };

    return chain([
        mergeWith(
            apply(empty(), [
                schematic("workspace", workspaceOptions),
                move(options.directory),
            ])
        ),
        (_host: Tree, context: SchematicContext) => {
            let packageTask;
            if (!options.skipInstall) {
                packageTask = context.addTask(
                    new NodePackageInstallTask({
                        workingDirectory: options.directory,
                        packageManager: "yarn",
                    })
                );
            }
            if (!options.skipGit) {
                const commit =
                    typeof options.commit == "object"
                        ? options.commit
                        : !!options.commit
                            ? {}
                            : false;

                context.addTask(
                    new RepositoryInitializerTask(options.directory, commit),
                    packageTask ? [packageTask] : []
                );
            }
        }
    ]);
}
