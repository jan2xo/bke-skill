import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

// The published plugin uses workers.dev: do not accidentally disable its only route.
const wrangler = JSON.parse(readFileSync(new URL('../wrangler.jsonc', import.meta.url)));
const pluginMcp = JSON.parse(readFileSync(new URL('../integrations/chatgpt/bke-skills/mcp.json', import.meta.url)));
assert.equal(wrangler.workers_dev, pluginMcp.mcpServers['bke-skills'].url.includes('.workers.dev/'));

const endpoint = 'http://127.0.0.1:8787/mcp';
async function rpc(method, params, id) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      'MCP-Protocol-Version': '2025-11-25',
    },
    body: JSON.stringify({jsonrpc: '2.0', id, method, params}),
  });
  const raw = await response.text();
  assert.equal(response.status, 200, method + ': HTTP ' + response.status + ' ' + raw);
  const message = response.headers.get('content-type')?.includes('text/event-stream')
    ? raw.split(/\r?\n/).filter(line => line.startsWith('data: '))
      .map(line => JSON.parse(line.slice(6))).find(item => item.id === id)
    : JSON.parse(raw);
  assert.ok(message, method + ': missing response');
  assert.ok(!message.error, method + ': error ' + JSON.stringify(message.error));
  return message.result;
}
const init = await rpc('initialize', {
  protocolVersion: '2025-11-25', capabilities: {},
  clientInfo: {name: 'bke-ci-smoke', version: '1.0.0'},
}, 1);
assert.ok(init.protocolVersion);
const listing = await rpc('tools/list', {}, 2);
assert.deepEqual(listing.tools.map(x => x.name).sort(), ['get_skill', 'list_skills', 'primary_skill']);
for (const tool of listing.tools) {
  assert.deepEqual(tool.annotations, {
    readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false,
  }, tool.name + ': incorrect actual tools/list hints');
}
// Distinct primary tool is the first read, without a list call or arguments.
const initial = await rpc('tools/call', {name:'primary_skill', arguments:{}}, 3);
assert.ok(!initial.isError, JSON.stringify(initial));
const primary = JSON.parse(initial.content[0].text);
assert.equal(primary.name, 'bke-lean-engineering');
assert.ok(Array.isArray(primary.available_skills));
// Preserve the previously published get_skill(primary) contract for existing callers.
const oldPrimary = await rpc('tools/call', {
  name:'get_skill', arguments:{name:'bke-lean-engineering'},
}, 4);
assert.ok(!oldPrimary.isError, JSON.stringify(oldPrimary));
assert.deepEqual(JSON.parse(oldPrimary.content[0].text), primary);
const listed = await rpc('tools/call', {name:'list_skills',arguments:{}}, 5);
assert.ok(!listed.isError, JSON.stringify(listed));
const inventory = JSON.parse(listed.content[0].text);
const expectedNames = ['bke-causal-investigation', 'bke-decision-discipline',
  'bke-forge-bounded-execution',
  'bke-lean-engineering', 'bke-owner-handoff', 'bke-security-review',
  'bke-test-certification'];
assert.deepEqual(inventory.skills.map(s => s.name).sort(), expectedNames);
const expectedTree = execFileSync('git', ['rev-parse', 'HEAD^{tree}'],
  {encoding: 'utf8'}).trim();
assert.equal(inventory.tree_sha, expectedTree);
assert.equal(primary.tree_sha, inventory.tree_sha);
assert.deepEqual(primary.available_skills,
  inventory.skills.map(({name, description, blob_sha}) => ({name, description, blob_sha})));
assert.ok(primary.available_skills.every(x => typeof x.description === 'string' && x.description.length));
let requestId = 6;
for (const name of expectedNames) {
  const path = 'skills/' + name + '/SKILL.md';
  const expectedBlob = execFileSync('git', ['rev-parse', 'HEAD:' + path],
    {encoding: 'utf8'}).trim();
  const expectedText = execFileSync('git', ['show', 'HEAD:' + path], {encoding: 'utf8'});
  const metadata = inventory.skills.find(s => s.name === name);
  assert.equal(metadata.blob_sha, expectedBlob);
  assert.equal(metadata.path, path);
  const found = await rpc('tools/call', {
    name:'get_skill', arguments:{name, blob_sha:expectedBlob},
  }, requestId++);
  assert.ok(!found.isError, JSON.stringify(found));
  const skill = JSON.parse(found.content[0].text);
  assert.equal(skill.name, name);
  assert.equal(skill.blob_sha, expectedBlob);
  assert.equal(skill.tree_sha, expectedTree);
  assert.equal(Object.hasOwn(skill, 'content'), false);
  assert.equal(skill.skill_text, expectedText);
  if (name !== 'bke-lean-engineering') assert.equal(skill.available_skills, undefined);
  console.log('Pinned MCP retrieval matches committed bytes: ' + name);
}
assert.equal(primary.skill_text, execFileSync('git',
  ['show', 'HEAD:skills/bke-lean-engineering/SKILL.md'], {encoding: 'utf8'}));
for (const [args, error] of [
  [{name:'nonexistent-skill'}, /not found/],
  [{name:'bke-lean-engineering', blob_sha:'f'.repeat(40)}, /revision changed/],
  // This is the real primary blob from verified main before the current change.
  [{name:'bke-lean-engineering', blob_sha:'93af0e8cb0f21bb460fcd18c9ccf85c30630aecd'}, /revision changed/],
  // A valid SHA belonging to another current skill cannot be used to spoof the primary.
  [{name:'bke-lean-engineering', blob_sha:'45e7a79f4b8569b1c2f6f82cdb814086821f017c'}, /revision changed/],
  [{name:'../secret'}, /Invalid/],
]) {
  const result = await rpc('tools/call', {name:'get_skill', arguments:args}, requestId++);
  assert.equal(result.isError, true, JSON.stringify(result));
  assert.match(result.content[0].text, error);
}
console.log('Three read-only MCP tools, distinct primary-first index, pinned bytes, legacy callers, and fail-closed reads: PASS');
