import {McpServer} from '@modelcontextprotocol/server';
import {createMcpHandler} from 'agents/mcp/server';
import {z} from 'zod';
import {getSkill, listSkills} from './catalog.mjs';

function createServer() {
  const server = new McpServer({name: 'bke-skills', version: '0.1.0'});
  server.registerTool('list_skills', {
    description: 'List public BKE skills in the deployed GitHub-source release with immutable blob SHAs.',
  }, async () => {
    try {
      return {content: [{type: 'text', text: JSON.stringify(await listSkills())}]};
    } catch (error) {
      return {isError: true, content: [{type: 'text', text: String(error.message)}]};
    }
  });
  server.registerTool('get_skill', {
    description: 'Read one BKE SKILL.md in this release, optionally pinned to its listed Git blob SHA.',
    inputSchema: z.object({name: z.string(), blob_sha: z.string().optional()}),
  }, async ({name, blob_sha}) => {
    try {
      const {content: markdown, ...metadata} = await getSkill(name, blob_sha);
      // A nested JSON field named `content` is discarded by some ChatGPT MCP clients.
      // Preserve MCP TextContent while exposing the skill as unambiguous structured data.
      const payload = {...metadata, markdown};
      return {content: [{type: 'text', text: JSON.stringify(payload)}], structuredContent: payload};
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
