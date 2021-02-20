import { Hook, IConfig } from '@oclif/config'
import * as glob from 'globby';
import * as path from 'path';
import { PackageJsonFile } from '@doptools/tslib-cli-core';
import { findProjectRoot } from '../../util/project';

const hook: Hook<'init'> = async function (options) {
  const prjFile = findProjectRoot();
  if (prjFile === null) {
    this.log("Not a project")
  }
}

export default hook;