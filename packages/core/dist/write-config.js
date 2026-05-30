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
exports.writeConfig = writeConfig;
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function writeConfig(root, opts) {
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
