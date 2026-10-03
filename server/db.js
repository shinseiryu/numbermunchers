const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'numdb.sqlite');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		userName TEXT NOT NULL UNIQUE,
		firstName TEXT NOT NULL,
		lastName TEXT NOT NULL,
		password TEXT NOT NULL,
		currentLevel INTEGER NOT NULL DEFAULT 1,
		score INTEGER NOT NULL DEFAULT 0
	);

	CREATE TABLE IF NOT EXISTS sessions (
		cookieID TEXT PRIMARY KEY,
		userID INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		createdAt INTEGER NOT NULL
	);
`);

module.exports = db;
