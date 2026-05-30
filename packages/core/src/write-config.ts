import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

interface WriteConfigOpts {
  name: string;
  type: string;
  language: string;
  pm?: string;
  port?: number;
  force?: boolean;
}

export function writeConfig(root: string, opts: WriteConfigOpts): string {
  const absRoot = path.resolve(root);
  const aiRoot = path.join(absRoot, '.ai-agents');
  const configPath = path.join(aiRoot, 'config.json');

  if (fs.existsSync(configPath) && !opts.force) {
    throw new Error('Config exists. Use --force to overwrite.');
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let accessToken = '';
  const bytes = crypto.randomBytes(32);
  for (let i = 0; i < 32; i++) {
    accessToken += alphabet[bytes[i] % alphabet.length];
  }

  const config = {
    project_name: opts.name,
    project_type: opts.type,
    language: opts.language,
    package_manager: opts.pm ?? null,
    project_root: absRoot,
    docs_path: '.ai-agents/docs',
    tasks_file: '.ai-agents/tasks.json',
    dashboard_port: opts.port ?? 7842,
    access_token: accessToken,
    neo_agents_version: '1.4.0',
    created_at: new Date().toISOString(),
  };

  fs.mkdirSync(aiRoot, { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

  return 'Config written: .ai-agents/config.json';
}
