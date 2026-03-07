// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const db = new Database(path.join(DB_DIR, 'memory.db'));

// Initialize tables and FTS5 indexing
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Create FTS5 virtual table for full-text search
    CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
      content,
      content='memories',
      content_rowid='id'
    );

    -- Triggers to keep FTS table in sync
    CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON memories BEGIN
      INSERT INTO memories_fts(rowid, content) VALUES (new.id, new.content);
    END;

    CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON memories BEGIN
      INSERT INTO memories_fts(memories_fts, rowid, content) VALUES('delete', old.id, old.content);
    END;

    CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON memories BEGIN
      INSERT INTO memories_fts(memories_fts, rowid, content) VALUES('delete', old.id, old.content);
      INSERT INTO memories_fts(rowid, content) VALUES (new.id, new.content);
    END;
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS session_summaries (
      user_id INTEGER PRIMARY KEY,
      summary TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_facts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      fact TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✅ Database initialized successfully.");
}

export function saveFact(userId: number, category: string, fact: string) {
  const stmt = db.prepare('INSERT INTO user_facts (user_id, category, fact) VALUES (?, ?, ?)');
  stmt.run(userId, category, fact);
}

export function getFacts(userId: number, category?: string): any[] {
  let query = 'SELECT id, category, fact, updated_at FROM user_facts WHERE user_id = ?';
  const params: any[] = [userId];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY category ASC, updated_at DESC';
  return db.prepare(query).all(...params);
}

export function deleteFact(id: number) {
  const stmt = db.prepare('DELETE FROM user_facts WHERE id = ?');
  stmt.run(id);
}

export function saveSessionMessage(userId: number, role: string, content: string) {
  const stmt = db.prepare('INSERT INTO sessions (user_id, role, content) VALUES (?, ?, ?)');
  stmt.run(userId, role, content);
}

export function getSessionMessages(userId: number, limit: number = 20): any[] {
  const stmt = db.prepare('SELECT role, content FROM (SELECT * FROM sessions WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?) ORDER BY timestamp ASC');
  return stmt.all(userId, limit);
}

export function clearSession(userId: number) {
  const stmt = db.prepare('DELETE FROM sessions WHERE user_id = ?');
  stmt.run(userId);
}

export function getSessionSummary(userId: number): string | null {
  const stmt = db.prepare('SELECT summary FROM session_summaries WHERE user_id = ?');
  const result = stmt.get(userId) as any;
  return result ? result.summary : null;
}

export function saveSessionSummary(userId: number, summary: string) {
  const stmt = db.prepare('INSERT OR REPLACE INTO session_summaries (user_id, summary) VALUES (?, ?)');
  stmt.run(userId, summary);
}

import { syncAllMemoriesToMarkdown } from './memory/markdown.js';

export function saveMemory(content: string): number {
  const stmt = db.prepare('INSERT INTO memories (content) VALUES (?)');
  const result = stmt.run(content);

  // Sync to markdown
  const allMemories = db.prepare('SELECT id, content, timestamp FROM memories ORDER BY id ASC').all() as any[];
  syncAllMemoriesToMarkdown(allMemories);

  return result.lastInsertRowid as number;
}

export function searchMemories(query: string, limit: number = 10): any[] {
  // Use FTS5 match query
  const stmt = db.prepare(`
    SELECT m.id, m.content, m.timestamp, rank 
    FROM memories_fts fts
    JOIN memories m ON fts.rowid = m.id
    WHERE memories_fts MATCH ?
    ORDER BY rank
    LIMIT ?
  `);
  return stmt.all(`"${query}"*`, limit);
}

export function getRecentMemories(limit: number = 5): any[] {
  const stmt = db.prepare('SELECT id, content, timestamp FROM memories ORDER BY timestamp DESC LIMIT ?');
  return stmt.all(limit);
}
