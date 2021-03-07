import {
  apply,
  chain,
  mergeWith,
  template,
  Rule,
  renameTemplateFiles,
  url
} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";
import { WorkspaceOptions } from "./schema";
import versions from "../../versions.json";
import { fromUrl } from 'hosted-git-info';
export default function (options: WorkspaceOptions): Rule {
  const additionalOptions: any = {};

  if(options.repository){
    const repoInfo = fromUrl(options.repository);

    additionalOptions.bugs = repoInfo?.bugs();
    additionalOptions.homepage = repoInfo?.browse();
    additionalOptions.docs = repoInfo?.docs();
  }

  return chain([
    mergeWith(
      apply(url("./files"), [
        template({
          ...strings,
          ...options,
          ...additionalOptions,
          dot: ".",
          versions,
        }),
        renameTemplateFiles()
      ])
    )
  ]);
}
