import {McpServer} from '@modelcontextprotocol/server';
import {createMcpHandler} from 'agents/mcp/server';
import {z} from 'zod';
import {getSkill, listSkills} from './catalog.mjs';

function createServer() {
  const server = new McpServer({name: 'bke-skills', version: '0.1.0'});
  server.registerTool('list_skills', {
    description: 'List public BKE skills merged into GitHub main with immutable blob SHAs.',
  }, async () => {
    try {
      return {content: [{type: 'text', text: JSON.stringify(await listSkills())}]};
    } catch (error) {
      return {isError: true, content: [{type: 'text', text: String(error.message)}]};
    }
  });
  server.registerTool('get_skill', {
    description: 'Read one BKE SKILL.md on main, optionally pinned to its listed Git blob SHA.',
    inputSchema: {name: z.string(), blob_sha: z.string().optional()},
  }, async ({name, blob_sha}) => {
    try {
      return {content: [{type: 'text', text: JSON.stringify(await getSkill(name, blob_sha))}]};
    } catch (error) {
      return {isError: true, content: [{type: 'text', text: String(error.message)}]};
    }
  });
  return server;
}

const handler = createMcpHandler(createServer);
export default {
  fetch(request, env, context) {
    if (new URL(request.url).pathname !== '/mcp') return new Response('Not Found', {status: 404});
    return handler(request, env, context);
  },
};
