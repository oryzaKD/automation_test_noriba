import * as fs from 'fs';
import * as path from 'path';

const STATE_FILE = path.resolve(__dirname, '../../.test-state.json');

type CounterState = Record<string, number>;

function readState(): CounterState {
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf-8');
    return JSON.parse(raw) as CounterState;
  } catch {
    return {};
  }
}

function writeState(state: CounterState): void {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (error) {
    console.warn('⚠️  Unable to write test state file:', error);
  }
}

export function nextSequence(key: string = 'default'): number {
  const state = readState();
  const current = typeof state[key] === 'number' ? state[key] : 0;
  const next = current + 1;
  state[key] = next;
  writeState(state);
  return next;
}


