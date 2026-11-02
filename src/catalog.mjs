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
  return {...skill, tree_sha: snapshot.tree_sha};
}
