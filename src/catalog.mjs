/** Public GitHub is the only source. This module never sends GitHub writes. */
const API = 'https://api.github.com/repos/jan2xo/bke-skill';
const SKILL_PATH = /^skills\/([a-z0-9]+(?:-[a-z0-9]+)*)\/SKILL\.md$/;
const BLOB_SHA = /^[0-9a-f]{40}$/;
const MAX_BYTES = 64 * 1024;

async function githubJson(url, fetcher) {
  const response = await fetcher(url, {
    method: 'GET',
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'bke-skill-mcp' },
  });
  if (!response.ok) throw new Error(`GitHub read failed (HTTP ${response.status})`);
  return response.json();
}

async function currentCatalog(fetcher) {
  const tree = await githubJson(`${API}/git/trees/main?recursive=1`, fetcher);
  if (tree.truncated || !BLOB_SHA.test(tree.sha ?? '') || !Array.isArray(tree.tree)) {
    throw new Error('GitHub skill inventory incomplete');
  }
  const skills = tree.tree.flatMap((item) => {
    const match = SKILL_PATH.exec(item.path ?? '');
    if (!match || item.type !== 'blob') return [];
    if (!BLOB_SHA.test(item.sha ?? '') || !Number.isSafeInteger(item.size) ||
        item.size < 0 || item.size > MAX_BYTES) {
      throw new Error('Invalid skill blob metadata');
    }
    return [{name: match[1], blob_sha: item.sha, path: item.path,
      source: `${API}/git/blobs/${item.sha}`}];
  });
  skills.sort((a, b) => a.name.localeCompare(b.name));
  return {tree_sha: tree.sha, skills};
}

/** List only files already merged into main, not draft PR files. */
export async function listSkills(fetcher = fetch) {
  return currentCatalog(fetcher);
}

/** Optional blob_sha protects a client against a changed skill between calls. */
export async function getSkill(name, blobSha, fetcher = fetch) {
  if (typeof name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) ||
      (blobSha !== undefined && !BLOB_SHA.test(blobSha))) {
    throw new Error('Invalid skill name or revision');
  }
  const {tree_sha, skills} = await currentCatalog(fetcher);
  const skill = skills.find((x) => x.name === name);
  if (!skill) throw new Error('Skill not found on main');
  if (blobSha && blobSha !== skill.blob_sha) {
    throw new Error('Skill revision changed; refresh the catalog');
  }
  const blob = await githubJson(skill.source, fetcher);
  if (blob.sha !== skill.blob_sha || blob.encoding !== 'base64' ||
      !Number.isSafeInteger(blob.size) || blob.size > MAX_BYTES ||
      typeof blob.content !== 'string') {
    throw new Error('GitHub skill blob did not verify');
  }
  const bytes = Uint8Array.from(atob(blob.content.replace(/\s/g, '')), (c) => c.charCodeAt(0));
  if (bytes.length !== blob.size) throw new Error('Skill length mismatch');
  return {...skill, tree_sha, content: new TextDecoder('utf-8', {fatal: true}).decode(bytes)};
}
