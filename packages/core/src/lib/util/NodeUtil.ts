import type { fromUrl } from 'hosted-git-info';
import parseArg, { Result } from 'npm-package-arg';
type GitHost = ReturnType<typeof fromUrl>;


export type PackageInfo = Result & {
    hosted?: GitHost
};

export class NodeUtil {

    public static packageInfo(packageId: string): PackageInfo {
        return parseArg(packageId) as PackageInfo;
    }
}