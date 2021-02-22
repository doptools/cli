
import { existsSync } from 'fs';
import Path from 'path';
import {findUpPackagePath} from 'resolve-package-path'

export function findProjectRoot(releativeTo: string = process.cwd()): string | null {
    releativeTo = Path.resolve(releativeTo);
    const root = Path.resolve('/');
    while (true) {
        const fpath = Path.join(releativeTo, 'dops.project.json');
        if(existsSync(fpath)){
            return releativeTo;
        }
        if(releativeTo === root){
            return null;
        }
        releativeTo = Path.dirname(releativeTo);
    }
}

export function findPackageRoot(releativeTo: string = process.cwd()): string | null {
    const path = findUpPackagePath(releativeTo, true);
    return path !== null ? Path.dirname(path) : null;
}