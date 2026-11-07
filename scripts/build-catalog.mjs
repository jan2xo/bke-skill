import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX40 = /^[0-9a-f]{40}$/;
const MAX_BYTES = 64 * 1024;
const API = 'https://api.github.com/repos/jan2xo/bke-skill';
const git = (root, ...args) => execFileSync('git', args, {
  cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
}).trim();

/** Builds a read-only catalog from committed Git objects, not network responses. */
export function buildSnapshot(root) {
  const source_commit = git(root, 'rev-parse', 'HEAD');
  const tree_sha = git(root, 'rev-parse', 'HEAD^{tree}');
  if (!HEX40.test(source_commit) || !HEX40.test(tree_sha)) {
    throw new Error('Source commit/tree not verified');
  }
  const skills = [];
  for (const entry of readdirSync(path.join(root, 'skills'), {withFileTypes: true})) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (!NAME.test(name)) throw new Error('Invalid skill directory name');
    const skillPath = 'skills/' + name + '/SKILL.md';
    const file = path.join(root, skillPath);
    const bytes = readFileSync(file);
    if (bytes.length > MAX_BYTES) throw new Error('Skill exceeds maximum size');
    const content = new TextDecoder('utf-8', {fatal: true}).decode(bytes);
    const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(content);
    if (!match || !match[1].split(/\r?\n/).some(x => x === 'name: ' + name)) {
      throw new Error('Skill frontmatter does not match directory');
    }
    const descriptionLine = match[1].split(/\r?\n/).find(x => x.startsWith('description: '));
    if (!descriptionLine || !descriptionLine.slice('description: '.length).trim()) {
      throw new Error('Skill requires a description for primary-first selection');
    }
    const description = descriptionLine.slice('description: '.length).trim();
    const blob_sha = createHash('sha1')
      .update('blob ' + bytes.length + '\0').update(bytes).digest('hex');
    if (git(root, 'rev-parse', 'HEAD:' + skillPath) !== blob_sha) {
      throw new Error('Skill bytes differ from committed Git source');
    }
    skills.push({name, description, blob_sha, path: skillPath,
      source: API + '/git/blobs/' + blob_sha, content});
  }
  skills.sort((a, b) => a.name.localeCompare(b.name));
  return {source_commit, tree_sha, skills};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
  const snapshot = buildSnapshot(root);
  const destination = path.join(root, 'src', 'catalog.snapshot.mjs');
  writeFileSync(destination,
    '// Generated from exact committed Git source. Do not edit.\n' +
    'export const snapshot = ' + JSON.stringify(snapshot) + ';\n');
  console.log('Bundled ' + snapshot.skills.length + ' skills from ' + snapshot.source_commit);
}
