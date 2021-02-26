import { Hook, load } from '@oclif/config'

export default async function (opts: any) {
  //process.stdout.write(`apply v hook ${opts.version}\n`);
}

/*
const hook: Hook<'init'> = async function (opts) {
  opts.config.loadPlugins()
  process.stdout.write(`example hook running custom\n`)
}
*/

/*await config.loadPlugins(path, "user", [{
    type: "user", // plugin type, user seems best, I have also seen "core" and "link" for npm-linked plugins
    name: "@my/plugin", // npm name
    root: "/some/path/node_modules/@my/plugin" // path to plugin code
}]);
*/