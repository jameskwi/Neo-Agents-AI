import * as fs from 'fs';
import * as path from 'path';

export interface StackInfo {
  framework: string;
  language: string;
  package_manager: string;
  project_name: string;
}

function detectPackageManager(projectRoot: string): string {
  if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) return 'pnpm';
  return 'npm';
}

function detectLanguage(projectRoot: string): 'TypeScript' | 'JavaScript' {
  return fs.existsSync(path.join(projectRoot, 'tsconfig.json')) ? 'TypeScript' : 'JavaScript';
}

function readText(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function readJson(filePath: string): Record<string, unknown> {
  try {
    return JSON.parse(readText(filePath));
  } catch {
    return {};
  }
}

export function detectStack(projectRoot: string): StackInfo {
  const join = (...p: string[]) => path.join(projectRoot, ...p);
  const exists = (p: string) => fs.existsSync(join(p));

  const pkg = readJson(join('package.json')) as {
    name?: string;
    dependencies?: Record<string, string>;
  };

  const projectName = (pkg.name as string | undefined) ?? path.basename(projectRoot);
  const deps = (pkg.dependencies as Record<string, string> | undefined) ?? {};

  // 1. Flutter / Dart
  if (exists('pubspec.yaml')) {
    const pubspec = readText(join('pubspec.yaml'));
    const match = pubspec.match(/^name:\s*(.+)/m);
    const name = match ? match[1].trim() : path.basename(projectRoot);
    return { framework: 'Flutter', language: 'Dart', package_manager: 'none', project_name: name };
  }

  // 2. Next.js
  if (exists('next.config.js') || exists('next.config.ts')) {
    return {
      framework: 'Next.js',
      language: detectLanguage(projectRoot),
      package_manager: detectPackageManager(projectRoot),
      project_name: projectName,
    };
  }

  // 3. React
  if (Object.keys(pkg).length > 0 && 'react' in deps) {
    return {
      framework: 'React',
      language: detectLanguage(projectRoot),
      package_manager: detectPackageManager(projectRoot),
      project_name: projectName,
    };
  }

  // 4. Vue
  if (Object.keys(pkg).length > 0 && 'vue' in deps) {
    return {
      framework: 'Vue',
      language: detectLanguage(projectRoot),
      package_manager: detectPackageManager(projectRoot),
      project_name: projectName,
    };
  }

  // 5. Python/Django
  if (exists('manage.py')) {
    return {
      framework: 'Python/Django',
      language: 'Python',
      package_manager: 'none',
      project_name: path.basename(projectRoot),
    };
  }

  // 6. Python/FastAPI
  if (exists('main.py') && readText(join('requirements.txt')).toLowerCase().includes('fastapi')) {
    return {
      framework: 'Python/FastAPI',
      language: 'Python',
      package_manager: 'none',
      project_name: path.basename(projectRoot),
    };
  }

  // 7. Python generic
  if (exists('requirements.txt') || exists('pyproject.toml')) {
    return {
      framework: 'Python',
      language: 'Python',
      package_manager: 'none',
      project_name: path.basename(projectRoot),
    };
  }

  // 8. Node.js (package.json present, no framework match)
  if (Object.keys(pkg).length > 0) {
    return {
      framework: 'Node.js',
      language: detectLanguage(projectRoot),
      package_manager: detectPackageManager(projectRoot),
      project_name: projectName,
    };
  }

  // 9. Static HTML
  if (exists('index.html') && !exists('package.json')) {
    return {
      framework: 'Static HTML',
      language: 'Unknown',
      package_manager: 'none',
      project_name: path.basename(projectRoot),
    };
  }

  // 10. Fallback
  return {
    framework: 'Generic',
    language: 'Unknown',
    package_manager: 'none',
    project_name: path.basename(projectRoot),
  };
}
