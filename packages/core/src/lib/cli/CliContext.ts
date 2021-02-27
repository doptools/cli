import { jsonc } from "jsonc";
import minimist, { ParsedArgs } from 'minimist';
import { dirname, join, relative, resolve } from "path";
import resolvePackagePath, { findUpPackagePath } from "resolve-package-path";
import { PackageJson } from "type-fest";

type ContextTypes = 'global' | 'workspace' | 'project';
type PackageTypes = ContextTypes | 'yarnws' | 'package';

enum ContextLevel {
    global,
    workspace,
    project
}

enum PackageLevel {
    global = ContextLevel.global,
    workspace = ContextLevel.workspace,
    yarnws = ContextLevel.workspace,
    package = ContextLevel.project,
    project = ContextLevel.project
}

interface IPackageSpec {
    type: PackageTypes;
    path: string;
    pathFrom: string;
    relPath: string;
    cliPath: string | null;
    usesThisContext: boolean;
    hasCliInstall: boolean;
}

export class CliContext {
    private static _instance?: Promise<CliContext | null>;

    public static get instance(): Promise<CliContext | null> {
        if (!this._instance) {
            this._instance = this.get();
        }
        return this._instance;

    }

    public static async get(fromPath: string = process.cwd(), argv: string[] = process.argv): Promise<CliContext | null> {
        const ws = new CliContext(fromPath, argv);
        const cwdPackage = findUpPackagePath(fromPath);
        if (cwdPackage !== null) {
            await ws.initialize(dirname(cwdPackage));
        }
        return ws;
    }

    private readonly _packages: IPackageSpec[] = [];
    private readonly _binPath: string;
    private readonly _argv: ParsedArgs;

    private constructor(
        private readonly _relativeTo: string,
        argv: string[]
    ) {
        this._argv = minimist(argv.slice(1));
        const binPath: string = this._argv._[0];
        this._binPath = dirname(dirname(binPath));
    }

    public get contextType(): ContextTypes {
        const m = this._packages.find(p => p.cliPath === this._binPath);
        return m?.type ? ContextLevel[PackageLevel[m.type]] as ContextTypes : 'global';
    }

    public get targetContextType(): ContextTypes {
        const lvl: ContextLevel | null = ContextLevel[this._argv._[1] as ContextTypes] as ContextLevel | undefined ?? null;
        if (lvl !== null) {
            return this._argv._[1] as ContextTypes;
        }
        const m = this._packages[0];
        return m?.type ? ContextLevel[PackageLevel[m.type]] as ContextTypes : 'global';
    }
    public get isCorrectContext(): boolean {
        return ContextLevel[this.contextType] === ContextLevel[this.targetContextType];
    }

    public get targetBinPath(): string | null {
        const type = this.targetContextType;
        if(type === 'global'){
            return null;
        }
        const p = this._packages.find(p => +PackageLevel[p.type] === +ContextLevel[type])
        return p?.cliPath ?? null;

    }

    public isValidContext(context: ContextTypes): boolean {
        return context === 'global' ? true : this._packages.findIndex(c => +PackageLevel[c.type] === +ContextLevel[context]) !== -1;
    }

    private async initialize(pkgPath: string): Promise<void> {
        const spec = await this.getPackageSpec(pkgPath);
        this._packages.push(spec);
        if (spec.type !== 'workspace') {
            const wsPackage = findUpPackagePath(dirname(pkgPath));
            if (wsPackage) {
                const wsSpec = await this.getPackageSpec(dirname(wsPackage));
                if (wsSpec) {
                    this._packages.push(wsSpec);
                }
            }
        }
    }

    private async getPackageSpec(pkgRoot: string): Promise<IPackageSpec> {
        pkgRoot = resolve(pkgRoot);
        const pkgPath = join(pkgRoot, 'package.json');
        const relPath = relative(resolve(this._relativeTo), pkgPath);
        const pathFrom = relative(pkgRoot, resolve(this._relativeTo));
        let cliPath = resolvePackagePath('@doptools/cli', pkgRoot);
        cliPath = cliPath ? dirname(cliPath) : null;
        const hasCliInstall = cliPath !== null;
        const usesThisContext = cliPath === this._binPath;

        let type: PackageTypes = 'package';

        const pkg = await jsonc.read(pkgPath) as PackageJson & { dops?: any };
        if (pkg.workspaces) {
            type = 'yarnws';
        } else if (pkg.dops) {
            type = 'project';
        }

        return {
            path: pkgPath,
            type,
            pathFrom,
            relPath,
            cliPath,
            usesThisContext,
            hasCliInstall
        };
    }
}
