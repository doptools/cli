import { Hook } from '@oclif/config';
import { findProjectRoot } from '../../util/project';

const hook: Hook<'init'> = async function (options) {
  const prjFile = findProjectRoot();
  if (prjFile === null) {
    this.log("Not a project")
  }
}

export default hook;