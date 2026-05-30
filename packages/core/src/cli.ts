import * as fs from 'fs';
import { detectStack } from './detect-stack';
import { writeBrd } from './write-brd';
import { writeSpec } from './write-spec';
import { updateTasks } from './update-tasks';
import { writeConfig } from './write-config';

function parseArgs(argv: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        result[arg.slice(2, eqIdx)] = arg.slice(eqIdx + 1);
      } else {
        result[arg.slice(2)] = '';
      }
    }
  }
  return result;
}

const [, , command, ...rest] = process.argv;
const flags = parseArgs(rest);

try {
  switch (command) {
    case 'detect-stack': {
      const root = flags['root'];
      if (!root) throw new Error('--root is required');
      console.log(JSON.stringify(detectStack(root), null, 2));
      break;
    }

    case 'write-brd': {
      const { root, slug, content: contentFlag } = flags as Record<string, string>;
      if (!root || !slug || !contentFlag) throw new Error('--root, --slug, --content are required');
      const content = fs.readFileSync(contentFlag, 'utf8');
      console.log(writeBrd(root, slug, content));
      break;
    }

    case 'write-spec': {
      const { root, slug, content: contentFlag } = flags as Record<string, string>;
      if (!root || !slug || !contentFlag) throw new Error('--root, --slug, --content are required');
      const content = fs.readFileSync(contentFlag, 'utf8');
      console.log(JSON.stringify(writeSpec(root, slug, content), null, 2));
      break;
    }

    case 'update-tasks': {
      const { root, slug, title } = flags as Record<string, string>;
      if (!root || !slug || !title) throw new Error('--root, --slug, --title are required');
      const result = updateTasks(root, {
        id: `${Date.now()}-${slug}`,
        title,
        brd_path: flags['brd-path'],
        spec_path: flags['spec-path'],
      });
      console.log(JSON.stringify(result, null, 2));
      break;
    }

    case 'write-config': {
      const { root, name, type, language } = flags;
      if (!root || !name || !type || !language) throw new Error('--root, --name, --type, --language are required');
      const result = writeConfig(root, {
        name,
        type,
        language,
        pm: flags['pm'] || undefined,
        port: flags['port'] ? parseInt(flags['port'], 10) : 7842,
        force: 'force' in flags,
      });
      console.log(result);
      break;
    }

    default:
      throw new Error(
        `Unknown command: ${command ?? '(none)'}. Valid: detect-stack, write-brd, write-spec, update-tasks, write-config`
      );
  }
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
