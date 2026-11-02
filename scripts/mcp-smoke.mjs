import assert from 'node:assert/strict';

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
console.log('MCP initialize and tools/list: PASS');
