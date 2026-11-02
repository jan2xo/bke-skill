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
assert.deepEqual(listing.tools.map(x => x.name).sort(), ['get_skill', 'list_skills']);
const listed = await rpc('tools/call', {name:'list_skills',arguments:{}}, 3);
assert.ok(!listed.isError, JSON.stringify(listed));
const inventory = JSON.parse(listed.content[0].text);
const expectedNames = ['bke-lean-engineering', 'bke-owner-handoff',
  'bke-security-review', 'bke-test-certification'];
assert.deepEqual(inventory.skills.map(s => s.name).sort(), expectedNames);
const expectedTree = execFileSync('git', ['rev-parse', 'HEAD^{tree}'],
  {encoding: 'utf8'}).trim();
assert.equal(inventory.tree_sha, expectedTree);
let requestId = 4;
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
  console.log('Pinned MCP retrieval matches committed bytes: ' + name);
}
console.log('MCP tool discovery and actual GitHub-backed skill retrieval: PASS');
