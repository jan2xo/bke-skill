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
    '---\nname: first\ndescription: Fixture skill for testing\n---\n# First\n');
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
  assert.ok(catalog.skills.every(x => typeof x.description === 'string' && x.description.length > 0));
});

test('primary-first read carries exact bytes and a same-tree selection index', async () => {
  const primary = await getSkill(knownName);
  const inventory = await listSkills();
  assert.equal(primary.tree_sha, inventory.tree_sha);
  assert.equal(primary.skill_text, execFileSync('git', ['show',
    'HEAD:skills/' + knownName + '/SKILL.md'], {encoding:'utf8'}));
  assert.deepEqual(primary.available_skills,
    inventory.skills.map(({name, description, blob_sha}) => ({name, description, blob_sha})));
  for (const item of primary.available_skills) {
    assert.ok(item.description.length > 0, item.name);
    assert.match(item.blob_sha, /^[0-9a-f]{40}$/);
    assert.equal(Object.hasOwn(item, 'skill_text'), false);
    const selected = await getSkill(item.name, item.blob_sha);
    assert.equal(selected.blob_sha, item.blob_sha);
    assert.equal(selected.tree_sha, primary.tree_sha);
    if (item.name !== knownName) assert.equal(selected.available_skills, undefined);
  }
});

test('primary guidance supports selective activation and short-session continuation', async () => {
  const {skill_text: text} = await getSkill(knownName);
  for (const rule of ['bke-decision-discipline', 'bke-causal-investigation',
    'bke-test-certification', 'bke-security-review', 'bke-owner-handoff',
    'bke-forge-bounded-execution', 'available_skills', 'blob_sha',
    'Codex', 'Sol', 'scope, evidence, or trust boundaries',
    'Checkpoints and queued CI', 'Never promise an unscheduled background continuation']) {
    assert.ok(text.includes(rule), rule);
  }
  assert.match(text, /do not load all skills automatically/i);
  assert.match(text, /Explicitly owner-assigned FORGE session only/);
});

test('all seven published skills return committed bytes without request-time network fetch', async () => {
  const catalog = await listSkills();
  const expectedNames = ['bke-causal-investigation', 'bke-decision-discipline',
    'bke-forge-bounded-execution',
    'bke-lean-engineering', 'bke-owner-handoff', 'bke-security-review',
    'bke-test-certification'];
  assert.deepEqual(catalog.skills.map(s => s.name).sort(), expectedNames);
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Unexpected network access'); };
  try {
    for (const expected of catalog.skills) {
      const source = 'HEAD:skills/' + expected.name + '/SKILL.md';
      const expectedBlob = execFileSync('git', ['rev-parse', source], {encoding:'utf8'}).trim();
      const expectedText = execFileSync('git', ['show', source], {encoding:'utf8'});
      const skill = await getSkill(expected.name, expected.blob_sha);
      assert.equal(skill.blob_sha, expectedBlob);
      assert.equal(skill.tree_sha, catalog.tree_sha);
      assert.equal(Object.hasOwn(skill, 'content'), false);
      assert.equal(skill.skill_text, expectedText);
      await assert.rejects(() => getSkill(expected.name, 'f'.repeat(40)), /changed/);
    }
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
  assert.equal(first.skills[0].description, 'Fixture skill for testing');
  writeFileSync(path.join(root,'skills','first','SKILL.md'),
    '---\nname: first\ndescription: Fixture skill for testing\n---\n# Modified\n');
  assert.throws(() => buildSnapshot(root), /differ/);
});

test('build picks up new committed skills and fails closed for bad content', (t) => {
  const root = fixture(t);
  const second = path.join(root,'skills','second');
  mkdirSync(second);
  writeFileSync(path.join(second,'SKILL.md'),'---\nname: second\ndescription: Second fixture skill\n---\n# Second\n');
  execFileSync('git', ['add','.'], {cwd:root});
  execFileSync('git', ['-c','user.name=Test','-c','user.email=test@example.invalid',
    'commit','-qm','added'], {cwd:root});
  assert.deepEqual(buildSnapshot(root).skills.map(s=>s.name), ['first','second']);
  writeFileSync(path.join(second,'SKILL.md'),'---\nname: wrong\ndescription: Wrong fixture skill\n---\n# Wrong\n');
  assert.throws(() => buildSnapshot(root), /frontmatter/);
  writeFileSync(path.join(second,'SKILL.md'),'x'.repeat(65537));
  assert.throws(() => buildSnapshot(root), /maximum size/);
});

test('FORGE failed CI requires first-error causal investigation, not a platform blocker guess', async () => {
  const forge = await getSkill('bke-forge-bounded-execution');
  const text = forge.skill_text;
  assert.match(text, /Failed run = investigate the first failure/);
  assert.match(text, /bke-causal-investigation/);
  assert.match(text, /earliest actionable failure/);
  assert.match(text, /issue_comment/);
  assert.match(text, /workflow_dispatch/);
  assert.match(text, /SOURCE_OR_TEST/);
  assert.match(text, /WORKFLOW_OR_TRIGGER/);
  assert.match(text, /DEPENDENCY_OR_REGISTRY/);
  assert.match(text, /ACTUAL_TOOL_UNAVAILABLE/);
  assert.match(text, /Run the smallest falsifiable correction now/);
  assert.match(text, /prevents \*\*every currently safe authorized next action\*\*/);
  assert.match(text, /Checkpoint is not task completion/);
  assert.match(text, /One skipped issue-comment event is not proof/);
  assert.doesNotMatch(text, /Aim to stop initiating new engineering mutations by minute 15/);
});

test('FORGE bounded execution is explicit opt-in and not a Codex rule', async () => {
  const forge = await getSkill('bke-forge-bounded-execution');
  assert.match(forge.skill_text, /FORGE ONLY/);
  assert.match(forge.skill_text, /Never apply this skill to Codex/);
  assert.match(forge.skill_text, /20 minutes elapsed wall-clock/);
  const investigation = await getSkill('bke-causal-investigation');
  assert.match(investigation.skill_text, /does not impose FORGE session time limits/);
});

test('snapshot build refuses missing descriptions rather than serving incomplete selection metadata', (t) => {
  const root = fixture(t);
  writeFileSync(path.join(root, 'skills', 'first', 'SKILL.md'),
    '---\nname: first\n---\n# No description\n');
  execFileSync('git', ['add','.'], {cwd: root});
  execFileSync('git', ['-c','user.name=Test','-c','user.email=test@example.invalid',
    'commit','-qm','missing-description'], {cwd: root});
  assert.throws(() => buildSnapshot(root), /requires a description/);
});
