import * as fs from 'fs';
import * as path from 'path';

export function writeBrd(projectRoot: string, slug: string, content: string): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  const targetDir = path.join(projectRoot, '.ai-agents', 'docs', 'BA');
  const filePath = path.join(targetDir, `${dateStr}-${slug}.md`);

  fs.mkdirSync(targetDir, { recursive: true });

  if (fs.existsSync(filePath)) {
    throw new Error(`BRD already exists: ${filePath}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}
