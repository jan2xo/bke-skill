import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {getSkill, listSkills} from '../src/catalog.mjs';
import {buildSnapshot} from '../scripts/build-catalog.mjs';

const knownName = 'bke-lean-engineering';
function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'bke-skills-fixture-'));
  t.after(() => rmSync(root, {recursive:true,force:true}));
  mkdirSync(path.join(root, 'skills', 'first'), {recursive:true});
  writeFileSync(path.join(root, 'skills', 'first', 'SKILL.md'),
    '---\nname: first\n---\n# First\n');
  execFileSync('git', ['init','-q'], {cwd:root});
  execFileSync('git', ['add','.'], {cwd:root});
  execFileSync('git', ['-c','user.name=Test','-c','user.email=test@example.invalid',
    'commit','-qm','fixture'], {cwd:root});
  return root;
}

test('catalog lists committed skills with Git SHA metadata, not content', async () => {
  const catalog = await listSkills();
  assert.match(catalog.tree_sha, /^[a-f0-9]{40}$/);
  assert.ok(catalog.skills.some(x => x.name === knownName));
  assert.equal(catalog.skills.find(x => x.name === knownName).content, undefined);
});

test('getSkill returns full content without any request-time network fetch', async () => {
  const expected = (await listSkills()).skills.find(x => x.name === knownName);
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Unexpected network access'); };
  try {
    const skill = await getSkill(knownName, expected.blob_sha);
    assert.equal(skill.blob_sha, expected.blob_sha);
    assert.ok(skill.content.includes('# BKE Lean Engineering'));
  } finally { globalThis.fetch = original; }
});

test('rejects invalid names, missing skills and stale revisions', async () => {
  await assert.rejects(() => getSkill('../secret'), /Invalid/);
  await assert.rejects(() => getSkill(knownName, 'bad'), /Invalid/);
  await assert.rejects(() => getSkill('nonexistent-skill'), /not found/);
  await assert.rejects(() => getSkill(knownName, 'f'.repeat(40)), /changed/);
});

test('build snapshot uses real Git blobs and rejects uncommitted changes', (t) => {
  const root = fixture(t);
  const first = buildSnapshot(root);
  const expected = execFileSync('git', ['rev-parse','HEAD:skills/first/SKILL.md'],
    {cwd:root,encoding:'utf8'}).trim();
  assert.equal(first.skills[0].blob_sha, expected);
  writeFileSync(path.join(root,'skills','first','SKILL.md'),
    '---\nname: first\n---\n# Modified\n');
  assert.throws(() => buildSnapshot(root), /differ/);
});

test('build picks up new committed skills and fails closed for bad content', (t) => {
  const root = fixture(t);
  const second = path.join(root,'skills','second');
  mkdirSync(second);
  writeFileSync(path.join(second,'SKILL.md'),'---\nname: second\n---\n# Second\n');
  execFileSync('git', ['add','.'], {cwd:root});
  execFileSync('git', ['-c','user.name=Test','-c','user.email=test@example.invalid',
    'commit','-qm','added'], {cwd:root});
  assert.deepEqual(buildSnapshot(root).skills.map(s=>s.name), ['first','second']);
  writeFileSync(path.join(second,'SKILL.md'),'---\nname: wrong\n---\n# Wrong\n');
  assert.throws(() => buildSnapshot(root), /frontmatter/);
  writeFileSync(path.join(second,'SKILL.md'),'x'.repeat(65537));
  assert.throws(() => buildSnapshot(root), /maximum size/);
});
