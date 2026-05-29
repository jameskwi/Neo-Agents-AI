import * as fs from 'fs';
import * as path from 'path';

export interface WriteSpecResult {
  path: string;
  action: 'created' | 'appended' | 'skipped';
}

const BA_HEADER = '## BA — Business Requirements';
const BA_FOOTER = '---';

export function writeSpec(
  projectRoot: string,
  slug: string,
  brdContent: string
): WriteSpecResult {
  const specDir = path.join(projectRoot, '.ai-agents', 'docs', 'SPEC');
  const filePath = path.join(specDir, `${slug}-spec.md`);

  fs.mkdirSync(specDir, { recursive: true });

  if (!fs.existsSync(filePath)) {
    const initialContent = `# ${slug} Spec\n\n${BA_HEADER}\n\n${brdContent}\n\n${BA_FOOTER}\n`;
    fs.writeFileSync(filePath, initialContent, 'utf8');
    return { path: filePath, action: 'created' };
  }

  const existing = fs.readFileSync(filePath, 'utf8');
  if (existing.includes(BA_HEADER)) {
    return { path: filePath, action: 'skipped' };
  }

  fs.appendFileSync(filePath, `\n\n${BA_HEADER}\n\n${brdContent}\n\n${BA_FOOTER}\n`);
  return { path: filePath, action: 'appended' };
}
