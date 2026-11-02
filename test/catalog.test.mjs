import test from 'node:test';
import assert from 'node:assert/strict';
import {getSkill, listSkills} from '../src/catalog.mjs';

const sha = 'a'.repeat(40), treeSha = 'b'.repeat(40);
const skillContent = '---\nname: bke-lean-engineering\n---\n# Lean\n';
const entry = {path:'skills/bke-lean-engineering/SKILL.md', type:'blob', sha,
  size:new TextEncoder().encode(skillContent).length};
const inventory = {sha:treeSha, truncated:false, tree:[entry,
  {path:'bke.md',type:'blob',sha:'c'.repeat(40),size:200}]};
const blob = {sha, size:entry.size, encoding:'base64',
  content:Buffer.from(skillContent).toString('base64')};
function mock({tree=inventory, value=blob, status=200}={}) {
  const calls=[];
  const fetcher=async (url, options)=> {
    calls.push({url, options});
    return {ok:status===200,status,json:async()=>url.includes('/git/blobs/')?value:tree};
  };
  return {fetcher,calls};
}

test('list only main SKILL.md paths and expose pinned Git blob SHA',async()=>{
  const x=mock();const list=await listSkills(x.fetcher);
  assert.equal(list.tree_sha,treeSha);
  assert.deepEqual(list.skills.map(v=>v.name),['bke-lean-engineering']);
  assert.equal(list.skills[0].blob_sha,sha);
  assert.equal(x.calls.length,1);
  assert.equal(x.calls[0].options.method,'GET');
});
test('get returns verified content and performs GET requests only',async()=>{
  const x=mock();const s=await getSkill('bke-lean-engineering',sha,x.fetcher);
  assert.equal(s.content,skillContent);
  assert.equal(s.blob_sha,sha);
  assert.equal(x.calls.length,2);
  assert.ok(x.calls.every(c=>c.options.method==='GET'));
});
test('missing/unmerged skill and invalid path do not fetch arbitrary content',async()=>{
  const x=mock();await assert.rejects(()=>getSkill('../bke.md',undefined,x.fetcher),/Invalid/);
  await assert.rejects(()=>getSkill('not-yet-merged',undefined,x.fetcher),/not found/);
  assert.equal(x.calls.length,1);
});
test('stale version, truncated inventory and malformed metadata fail closed',async()=>{
  const x=mock();await assert.rejects(()=>getSkill('bke-lean-engineering','d'.repeat(40),x.fetcher),/changed/);
  await assert.rejects(()=>listSkills(mock({tree:{...inventory,truncated:true}}).fetcher),/incomplete/);
  await assert.rejects(()=>listSkills(mock({tree:{...inventory,tree:[{...entry,sha:'bad'}]}}).fetcher),/Invalid/);
});
test('failed GitHub requests or mismatched blob SHA never become instructions',async()=>{
  await assert.rejects(()=>listSkills(mock({status:403}).fetcher),/403/);
  await assert.rejects(()=>getSkill('bke-lean-engineering',undefined,
    mock({value:{...blob,sha:'d'.repeat(40)}}).fetcher),/verify/);
});
