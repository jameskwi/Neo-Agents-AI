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
exports.updateTasks = updateTasks;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function updateTasks(projectRoot, task) {
    const tasksPath = path.join(projectRoot, '.ai-agents', 'tasks.json');
    if (!fs.existsSync(tasksPath)) {
        fs.mkdirSync(path.dirname(tasksPath), { recursive: true });
        fs.writeFileSync(tasksPath, JSON.stringify({ tasks: [] }, null, 2), 'utf8');
    }
    const data = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
    if (data.tasks.some((t) => t.id === task.id)) {
        return { action: 'skipped', taskId: task.id };
    }
    const now = new Date().toISOString();
    const entry = {
        id: task.id,
        title: task.title,
        status: '⏳ in progress',
        column: 'In Progress',
        created_at: now,
        updated_at: now,
        steps: { ba: '✅', sa: '🔲', ds: '🔲', dev: '🔲' },
        docs: {
            ba_doc: task.brd_path ?? '',
            sa_doc: '',
            ds_doc: '',
            dev_doc: '',
            spec_doc: task.spec_path ?? '',
        },
    };
    data.tasks.push(entry);
    fs.writeFileSync(tasksPath, JSON.stringify(data, null, 2), 'utf8');
    return { action: 'added', taskId: task.id };
}
