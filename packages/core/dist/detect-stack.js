"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectStack = detectStack;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function detectPackageManager(projectRoot) {
    if (fs.existsSync(path.join(projectRoot, 'yarn.lock')))
        return 'yarn';
    if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml')))
        return 'pnpm';
    return 'npm';
}
function detectLanguage(projectRoot) {
    return fs.existsSync(path.join(projectRoot, 'tsconfig.json')) ? 'TypeScript' : 'JavaScript';
}
function readText(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    }
    catch {
        return '';
    }
}
function readJson(filePath) {
    try {
        return JSON.parse(readText(filePath));
    }
    catch {
        return {};
    }
}
function detectStack(projectRoot) {
    const join = (...p) => path.join(projectRoot, ...p);
    const exists = (p) => fs.existsSync(join(p));
    const pkg = readJson(join('package.json'));
    const projectName = pkg.name ?? path.basename(projectRoot);
    const deps = pkg.dependencies ?? {};
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
