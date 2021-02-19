import { Hook, IConfig } from '@oclif/config'
import * as glob from 'globby';
import * as path from 'path';
import { PackageJsonFile } from '@doptools/tslib-cli-core';

const hook: Hook<'init'> = async function (options) {
  const cwd = process.cwd();
  const plugins = await Promise.all(glob
    .sync([
      `node_modules/@*/*/${options.config.bin}.oclif.plugin.json`,
      `node_modules/*/${options.config.bin}.oclif.plugin.json`,
    ])
    .map(_ => path.join(cwd, path.dirname(_)))
    .map(async dir => ({
      type: "link",
      name: (await new PackageJsonFile(path.join(dir, 'package.json')).loadFile()).name,
      root: dir
    })));
  await (options.config as any).loadPlugins('package.json', "link", plugins);
}

export default hook;