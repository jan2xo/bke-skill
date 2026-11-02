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
const expectedBlob = execFileSync('git', ['rev-parse', 'HEAD:skills/bke-lean-engineering/SKILL.md'],
  {encoding: 'utf8'}).trim();
const listed = await rpc('tools/call', {name:'list_skills',arguments:{}}, 3);
assert.ok(!listed.isError, JSON.stringify(listed));
const inventory = JSON.parse(listed.content[0].text);
assert.equal(inventory.skills.find(s => s.name === 'bke-lean-engineering')?.blob_sha, expectedBlob);
const ownerBlob = execFileSync('git', ['rev-parse', 'HEAD:skills/bke-owner-handoff/SKILL.md'],
  {encoding: 'utf8'}).trim();
assert.equal(inventory.skills.find(s => s.name === 'bke-owner-handoff')?.blob_sha, ownerBlob);
const found = await rpc('tools/call', {
  name:'get_skill',arguments:{name:'bke-lean-engineering',blob_sha:expectedBlob},
}, 4);
assert.ok(!found.isError, JSON.stringify(found));
const skill = JSON.parse(found.content[0].text);
assert.equal(skill.blob_sha, expectedBlob);
assert.equal(Object.hasOwn(skill, 'content'), false);
assert.ok(skill.skill_text.includes('# BKE Lean Engineering'));
assert.ok(skill.skill_text.length > 1000);
const ownerResult = await rpc('tools/call', {
  name:'get_skill',arguments:{name:'bke-owner-handoff',blob_sha:ownerBlob},
}, 5);
assert.ok(!ownerResult.isError, JSON.stringify(ownerResult));
const ownerSkill = JSON.parse(ownerResult.content[0].text);
assert.equal(ownerSkill.blob_sha, ownerBlob);
assert.ok(ownerSkill.skill_text.includes('## 4. Intelligent UI behavior'));
console.log('MCP tool discovery and actual GitHub-backed skill retrieval: PASS');

