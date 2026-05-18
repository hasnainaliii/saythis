import * as SQLite from 'expo-sqlite';

let dbInitialized = false;

export const getDb = async () => {
  const db = await SQLite.openDatabaseAsync('tool_sessions.db');
  if (!dbInitialized) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS pending_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL,
        attempts INTEGER DEFAULT 0
      );
    `);
    dbInitialized = true;
  }
  return db;
};

export const initOfflineQueue = async () => {
  await getDb(); // Just call getDb to initialize
};

export const addToQueue = async (payload: any) => {
  try {
    const db = await getDb();
    await db.runAsync(
      'INSERT INTO pending_sessions (payload, created_at, attempts) VALUES (?, ?, ?)',
      [JSON.stringify(payload), new Date().toISOString(), 0]
    );
  } catch (error) {
    console.error("Failed to add to offline queue:", error);
  }
};

export const getPendingSessions = async () => {
  try {
    const db = await getDb();
    return await db.getAllAsync<{ id: number, payload: string, created_at: string, attempts: number }>(
      'SELECT * FROM pending_sessions'
    );
  } catch (error) {
    console.error("Failed to get pending sessions:", error);
    return [];
  }
};

export const removePendingSession = async (id: number) => {
  try {
    const db = await getDb();
    await db.runAsync('DELETE FROM pending_sessions WHERE id = ?', [id]);
  } catch (error) {
    console.error("Failed to remove pending session:", error);
  }
};

export const incrementAttempt = async (id: number, attempts: number) => {
  try {
    const db = await getDb();
    if (attempts >= 4) { // Next attempt will be 5
      await removePendingSession(id);
      console.warn(`Deleted pending session ${id} after 5 failed attempts`);
    } else {
      await db.runAsync('UPDATE pending_sessions SET attempts = attempts + 1 WHERE id = ?', [id]);
    }
  } catch (error) {
    console.error("Failed to increment attempt:", error);
  }
};
