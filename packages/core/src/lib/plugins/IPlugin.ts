

export enum PluginType {
    MAIN = 'main',
    CORE = 'core',
    GLOBAL = 'global',
    WORKSPACE = 'workspace',
    PROJECT = 'project'
}

export enum CommandScope {
    GLOBAL = "global",
    WORKSPACE = "workspace",
    PROJECT = "project",
}

export interface IPLugin {
    name: string;
    type: PluginType;
}