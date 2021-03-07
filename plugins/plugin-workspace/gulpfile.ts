import { compileFromFile } from "json-schema-to-typescript";
import path from "path";
import { writeFile } from "fs/promises";
import glob from "glob";
import gulp from 'gulp';

export async function buildSchema() {
  return new Promise<void>((res, rej) => {
    glob("schematics/*/schema.json", { cwd: "src" }, (e, files) => {
      files.forEach(async (file) => {
        const dir = path.dirname(file);
        var int = await compileFromFile(path.join("src", file));
        await writeFile(path.join("src", dir, "schema.d.ts"), int, {
          encoding: "utf-8",
        });
        await writeFile(path.join("lib", dir, "schema.d.ts"), int, {
          encoding: "utf-8",
        });
      });
      res();
    });
  });
}

export async function copyFiles() {
  return gulp.src([
    'src/schematics.json',
    'src/schematics/*/schema.json',
    'src/schematics/*/files*/**'
  ], { base: "src" })
    .pipe(gulp.dest('lib'));
}

export async function codeFormat() {
  //prettier.check()
}

export async function checkCodeFormat() {
  // var c = prettier.check('**');
  //console.log(c);
}

function watch() {
  return gulp.watch("src/schematics/*/schema.json", buildSchema);
}


exports.default = watch;
