import path from 'path';

export function filterToFirst(list: any[], filterCallback: (error: any) => boolean) {
  return list.filter(filterCallback)[0];
}

export function determineExtension(program: any) {
  return typeof program.typescript === 'boolean' ? 'tsx' : 'js';
}

export function noServingDirProvided(global_ServingDir) {
  return global_ServingDir == undefined;
}

export function getAbsoluteEntryPath(
  { program, servingDir }: { program: any, servingDir: string }
) {
  return typeof program.entry === 'string' ?
    path.join(process.cwd(), program.entry) :
    path.join(process.cwd(), servingDir, `index.${determineExtension(program)}`);
}
