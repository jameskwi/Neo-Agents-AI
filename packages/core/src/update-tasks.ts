import * as fs from 'fs';
import * as path from 'path';

export interface NewTask {
  id: string;
  title: string;
  brd_path?: string;
  spec_path?: string;
}

export interface TaskEntry {
  id: string;
  title: string;
  status: string;
  column: string;
  created_at: string;
  updated_at: string;
  steps: { ba: string; sa: string; ds: string; dev: string };
  docs: { ba_doc: string; sa_doc: string; ds_doc: string; dev_doc: string; spec_doc: string };
}

export interface TasksFile {
  tasks: TaskEntry[];
}

export function updateTasks(
  projectRoot: string,
  task: NewTask
): { action: 'added' | 'skipped'; taskId: string } {
  const tasksPath = path.join(projectRoot, '.ai-agents', 'tasks.json');

  if (!fs.existsSync(tasksPath)) {
    fs.mkdirSync(path.dirname(tasksPath), { recursive: true });
    fs.writeFileSync(tasksPath, JSON.stringify({ tasks: [] }, null, 2), 'utf8');
  }

  const data: TasksFile = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));

  if (data.tasks.some((t) => t.id === task.id)) {
    return { action: 'skipped', taskId: task.id };
  }

  const now = new Date().toISOString();
  const entry: TaskEntry = {
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
