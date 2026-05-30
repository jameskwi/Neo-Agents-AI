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
const fs = __importStar(require("fs"));
const detect_stack_1 = require("./detect-stack");
const write_brd_1 = require("./write-brd");
const write_spec_1 = require("./write-spec");
const update_tasks_1 = require("./update-tasks");
const write_config_1 = require("./write-config");
function parseArgs(argv) {
    const result = {};
    for (const arg of argv) {
        if (arg.startsWith('--')) {
            const eqIdx = arg.indexOf('=');
            if (eqIdx !== -1) {
                result[arg.slice(2, eqIdx)] = arg.slice(eqIdx + 1);
            }
            else {
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
            if (!root)
                throw new Error('--root is required');
            console.log(JSON.stringify((0, detect_stack_1.detectStack)(root), null, 2));
            break;
        }
        case 'write-brd': {
            const { root, slug, content: contentFlag } = flags;
            if (!root || !slug || !contentFlag)
                throw new Error('--root, --slug, --content are required');
            const content = fs.readFileSync(contentFlag, 'utf8');
            console.log((0, write_brd_1.writeBrd)(root, slug, content));
            break;
        }
        case 'write-spec': {
            const { root, slug, content: contentFlag } = flags;
            if (!root || !slug || !contentFlag)
                throw new Error('--root, --slug, --content are required');
            const content = fs.readFileSync(contentFlag, 'utf8');
            console.log(JSON.stringify((0, write_spec_1.writeSpec)(root, slug, content), null, 2));
            break;
        }
        case 'update-tasks': {
            const { root, slug, title } = flags;
            if (!root || !slug || !title)
                throw new Error('--root, --slug, --title are required');
            const result = (0, update_tasks_1.updateTasks)(root, {
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
            if (!root || !name || !type || !language)
                throw new Error('--root, --name, --type, --language are required');
            const result = (0, write_config_1.writeConfig)(root, {
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
            throw new Error(`Unknown command: ${command ?? '(none)'}. Valid: detect-stack, write-brd, write-spec, update-tasks, write-config`);
    }
}
catch (err) {
    console.error(err.message);
    process.exit(1);
}
