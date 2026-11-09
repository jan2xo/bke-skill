/** The deployed immutable skill snapshot is derived only from committed Git. */
import {snapshot} from './catalog.snapshot.mjs';

const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BLOB_SHA = /^[0-9a-f]{40}$/;

/** No request-time GitHub API calls, credentials, or writable storage. */
export async function listSkills() {
  const skills = snapshot.skills.map(({content, ...metadata}) => metadata);
  return {tree_sha: snapshot.tree_sha, skills};
}

/** An immutable version check keeps client reads fail-closed across deployments. */
export async function getSkill(name, blobSha) {
  if (typeof name !== 'string' || !SKILL_NAME.test(name) ||
      (blobSha !== undefined && (typeof blobSha !== 'string' || !BLOB_SHA.test(blobSha)))) {
    throw new Error('Invalid skill name or revision');
  }
  const skill = snapshot.skills.find((item) => item.name === name);
  if (!skill) throw new Error('Skill not found in deployed release');
  if (blobSha && blobSha !== skill.blob_sha) {
    throw new Error('Skill revision changed; refresh the catalog');
  }
  // Avoid an inner JSON `content` field: ChatGPT MCP clients can discard that payload.
  // Keep the actual SKILL.md bytes intact, including for other MCP clients.
  const result = {name: skill.name, blob_sha: skill.blob_sha, path: skill.path,
    source: skill.source, tree_sha: snapshot.tree_sha, skill_text: skill.content};
  if (name === 'bke-lean-engineering') {
    // Selection metadata comes from the same immutable snapshot as skill_text.
    result.available_skills = snapshot.skills.map(({name, description, blob_sha}) =>
      ({name, description, blob_sha}));
  }
  return result;
}
