import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'fooled_users.db'));
db.pragma('journal_mode = WAL');

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS fooled_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    htno TEXT NOT NULL,
    semester TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/fooled', (req, res) => {
    const { htno, semester } = req.body;
    if (!htno || !semester) {
      return res.status(400).json({ error: 'Missing htno or semester' });
    }

    try {
      const stmt = db.prepare('INSERT INTO fooled_users (htno, semester) VALUES (?, ?)');
      stmt.run(htno, semester);
      res.json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/fooled', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM fooled_users ORDER BY timestamp DESC');
      const users = stmt.all();
      res.json(users);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
