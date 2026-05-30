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
exports.writeSpec = writeSpec;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const BA_HEADER = '## BA — Business Requirements';
const BA_FOOTER = '---';
function writeSpec(projectRoot, slug, brdContent) {
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
