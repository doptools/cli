
import { existsSync } from 'fs';
import Path from 'path';

export function findProjectRoot(releativeTo: string = process.cwd()): string | null {
    releativeTo = Path.resolve(releativeTo);
    const root = Path.resolve('/');
    while (true) {
        const fpath = Path.join(releativeTo, 'dops.project.json');
        if(existsSync(fpath)){
            return fpath;
        }
        if(releativeTo === root){
            return null;
        }
        releativeTo = Path.dirname(releativeTo);
    }
}